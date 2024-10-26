// Update the imports at the top of App.tsx
import React, { useState, useEffect } from 'react';
import { Save, FileUp, FileDown, Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Categories, isFach, isFachgebiet } from './categories';
import { validateForm } from './utils/validators';
import { ErrorMessage } from './components/ErrorMessage';
import { generateMarkdownTemplates } from './utils/markdownTemplates';
import { FormSection } from './components/FormSection';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PreviewPage } from './pages/Preview';
import { FormProvider, useForm } from './context/FormContext';
import { MarkdownShortcutsHelp } from './components/MarkdownShortcutsHelp';
import { JSONPreview } from './components/JSONPreview';

// Move these interfaces to the top and export them
export interface Question {
  id: string;
  fach: string;
  fachgebiet: string;
  thema: string;
  question: string;
  answer: string;
  idealAnswer: string;
  tags: string[];
  schwierigkeit: string;
  kommentar: string;
}

export interface Teil {
  id: string;
  inhalt: string;
  schwierigkeit: string;
  questions?: Question[];
}

export interface FormDataType {
  version: string;
  id: string;
  state: string;
  examYear: string;
  examMonth: string;
  fach: string;
  fachgebiet: string;
  thema: string;
  kategorie: string;
  teil1: Teil & { questions: Question[] };
  teil2: Teil;
  teil3: Teil & { questions: Question[] };
  kommentar: string;
  schlagwoerter: string;
  schwierigkeit: string;
  pruefungskompetenz: string;
  verbundenThemen: string;
}

// Add this helper function at the component level
const updateQuestionTags = (question: Question): Question => {
  const tags = new Set(question.tags);
  // Add fach, fachgebiet, and thema to tags if they exist
  if (question.fach) tags.add(question.fach);
  if (question.fachgebiet) tags.add(question.fachgebiet);
  if (question.thema) tags.add(question.thema);
  return {
    ...question,
    tags: Array.from(tags)
  };
};

// Add these type definitions for event handlers
type InputChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

// Rename the existing component to Generator
function Generator() {
  const navigate = useNavigate();
  // Remove this line: const location = useLocation();
  const { formData, setFormData } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Add sequence number state
  const [sequenceNumber, setSequenceNumber] = useState(() => {
    const stored = localStorage.getItem('sequenceNumber');
    return stored ? parseInt(stored, 10) : 1;
  });

  // Move getNextSequenceNumber inside the component
  const getNextSequenceNumber = (): number => {
    const nextNum = sequenceNumber + 1;
    setSequenceNumber(nextNum);
    localStorage.setItem('sequenceNumber', nextNum.toString());
    return sequenceNumber;
  };

  // Use constants from Categories
  const { germanStates, faecher, kategorien } = Categories;

  // Add this new features to the existing state
  const [autoSave, setAutoSave] = useState(true);
  const [showPreview, setShowPreview] = useState(true);

  // Add auto-save functionality
  useEffect(() => {
    let saveTimer: NodeJS.Timeout;

    if (autoSave) {
      saveTimer = setTimeout(() => {
        try {
          localStorage.setItem('kpMedizinDraft', JSON.stringify(formData));
          setMessage('Automatisch gespeichert');
          setTimeout(() => setMessage(''), 2000);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setMessage('Automatisches Speichern fehlgeschlagen');
          setTimeout(() => setMessage(''), 3000);
        }
      }, 30000);
    }

    return () => {
      if (saveTimer) {
        clearTimeout(saveTimer);
      }
    };
  }, [formData, autoSave]);

  useEffect(() => {
    generateId();
  }, [formData.state, formData.examYear, formData.examMonth]);

  const generateId = () => {
    const { state, examYear, examMonth } = formData;
    if (state && examYear && examMonth) {
      const stateAbbr = state.substring(0, 2).toUpperCase();
      const paddedMonth = examMonth.toString().padStart(2, '0');
      const nextSequence = getNextSequenceNumber();
      const paddedSequence = nextSequence.toString().padStart(3, '0');
      
      const newId = `${stateAbbr}${examYear}${paddedMonth}${paddedSequence}`;
      setFormData(prevData => ({
        ...prevData,
        id: newId
      }));
    }
  };

  const validateField = (name: string, value: string) => {
    const requiredFields = [
      'state',
      'examYear',
      'examMonth',
      'fach',
      'fachgebiet',
      'thema',
      'kategorie'
    ];

    if (requiredFields.includes(name) && !value) {
      setErrors(prev => ({
        ...prev,
        [name]: `${name} ist ein Pflichtfeld`
      }));
      return false;
    }
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    return true;
  };

  const handleChange = (e: InputChangeEvent) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTeilChange = (
    teilName: 'teil1' | 'teil2' | 'teil3',
    fieldName: keyof Teil,
    value: string
  ) => {
    setFormData(prevData => ({
      ...prevData,
      [teilName]: {
        ...prevData[teilName],
        [fieldName]: value
      }
    }));
  };

  const handleQuestionChange = (teil: 'teil1' | 'teil3', index: number, field: keyof Question, value: string | string[]) => {
    setFormData(prevData => {
      const newQuestions = [...prevData[teil].questions];
      newQuestions[index] = {
        ...newQuestions[index],
        [field]: value
      };
      
      if (field === 'fach' || field === 'fachgebiet' || field === 'thema') {
        newQuestions[index] = updateQuestionTags(newQuestions[index]);
      }

      return {
        ...prevData,
        [teil]: {
          ...prevData[teil],
          questions: newQuestions
        }
      };
    });
  };

  const addQuestion = (teil: 'teil1' | 'teil3') => {
    setFormData(prevData => {
      const lastQuestion = prevData[teil].questions[prevData[teil].questions.length - 1] || {};
      const newQuestion: Question = {
        id: uuidv4(),
        fach: lastQuestion.fach || '',
        fachgebiet: lastQuestion.fachgebiet || '',
        thema: lastQuestion.thema || '',
        question: '',
        answer: '',
        idealAnswer: '',
        tags: lastQuestion.tags || [],
        schwierigkeit: '',
        kommentar: ''
      };
      return {
        ...prevData,
        [teil]: {
          ...prevData[teil],
          questions: [...prevData[teil].questions, newQuestion]
        }
      };
    });
  };

  const deleteQuestion = (teil: 'teil1' | 'teil3', index: number) => {
    setFormData(prevData => {
      const newQuestions = [...prevData[teil].questions];
      newQuestions.splice(index, 1);
      return {
        ...prevData,
        [teil]: {
          ...prevData[teil],
          questions: newQuestions
        }
      };
    });
  };

  // Modify the handleGenerateJSON function to only handle navigation
  const handleGenerateJSON = () => {
    setLoading(true);
    setMessage('');
    
    try {
      // First validate required fields
      const requiredFields = ['state', 'examYear', 'examMonth', 'fach', 'fachgebiet', 'thema', 'kategorie'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormDataType]);
      
      if (missingFields.length > 0) {
        setErrors(prev => ({
          ...prev,
          ...Object.fromEntries(missingFields.map(field => [field, `${field} ist ein Pflichtfeld`]))
        }));
        throw new Error('Bitte füllen Sie alle Pflichtfelder aus');
      }

      // Then use validateForm for additional validation
      const validationResult = validateForm(formData);
      if (!validationResult.isValid) {
        setErrors(prev => ({
          ...prev,
          validation: validationResult.errors.join(', ')
        }));
        throw new Error(validationResult.errors.join('\n'));
      }

      // Navigate to preview
      navigate('/preview', { state: { formData }, replace: true });
      setMessage('JSON generated successfully!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error generating JSON');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('kpMedizinDraft', JSON.stringify(formData));
    setMessage('Entwurf gespeichert');
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('kpMedizinDraft');
    if (draft) {
      setFormData(JSON.parse(draft));
      setMessage('Entwurf geladen');
    }
  };

  // Add this effect for keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSaveDraft();
            break;
          case 'j':
            e.preventDefault();
            navigate('/preview', { state: { formData } });
            break;
          case 'l':
            e.preventDefault();
            loadDraft();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  // Add effect to update preview whenever form data changes
  useEffect(() => {
    // Update the navigation state whenever formData changes
    navigate('.', { state: { formData }, replace: true });
  }, [formData, navigate]);

  // Update the handleIndentation function
  const handleIndentation = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    teilName: 'teil1' | 'teil2' | 'teil3',
    questionIndex?: number,
    field?: keyof Question
  ) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const value = textarea.value;
      
      let newText: string;
      let newCursorPos: number;

      if (e.shiftKey) {
        // Handle outdent (shift+tab)
        if (value.substring(start - 2, start) === '  ') {
          newText = value.substring(0, start - 2) + value.substring(start);
          newCursorPos = start - 2;
        } else {
          newText = value;
          newCursorPos = start;
        }
      } else {
        // Handle indent (tab)
        newText = value.substring(0, start) + '  ' + value.substring(start);
        newCursorPos = start + 2;
      }

      if (questionIndex !== undefined && field) {
        setFormData(prev => {
          // Ensure questions array exists and is an array
          const questions = prev[teilName].questions || [];
          const newQuestions = [...questions];
          newQuestions[questionIndex] = {
            ...newQuestions[questionIndex],
            [field]: newText
          };
          return {
            ...prev,
            [teilName]: {
              ...prev[teilName],
              questions: newQuestions
            }
          };
        });
      } else {
        setFormData(prev => ({
          ...prev,
          [teilName]: {
            ...prev[teilName],
            inhalt: newText
          }
        }));
      }

      // Set cursor position after state update
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main Form Column - Adjust width based on preview visibility */}
      <div className={`${showPreview ? 'w-[60%]' : 'w-full'} overflow-auto px-4`}>
        <div className="max-w-none py-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-600">
              KP Medizin Prüfungsfragen-Generator
            </h2>
            <div className="flex items-center gap-6"> {/* Increased gap from gap-4 to gap-6 */}
              <MarkdownShortcutsHelp />
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="h-5 w-5" />
                    <span className="text-sm">Preview ausblenden</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-5 w-5" />
                    <span className="text-sm">Preview einblenden</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <form className="space-y-4">
            {/* Basic Form Fields - More compact layout */}
            <div className="bg-white shadow-sm rounded-lg p-3">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Bundesland
                    {errors.state && <ErrorMessage message={errors.state} />}
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Auswählen</option>
                    {germanStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Prüfungsjahr
                    {errors.examYear && <ErrorMessage message={errors.examYear} />}
                  </label>
                  <select
                    name="examYear"
                    value={formData.examYear}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.examYear ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Auswählen</option>
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Prüfungsmonat
                    {errors.examMonth && <ErrorMessage message={errors.examMonth} />}
                  </label>
                  <select
                    name="examMonth"
                    value={formData.examMonth}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.examMonth ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Auswählen</option>
                    {[...Array(12)].map((_, i) =>
                      <option key={i} value={i + 1}>{i + 1}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Fach
                    {errors.fach && <ErrorMessage message={errors.fach} />}
                  </label>
                  <select
                    name="fach"
                    value={formData.fach}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.fach ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Auswählen</option>
                    {faecher.map(fach => (
                      <option key={fach} value={fach}>{fach}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Fachgebiet
                    {errors.fachgebiet && <ErrorMessage message={errors.fachgebiet} />}
                  </label>
                  <select
                    name="fachgebiet"
                    value={formData.fachgebiet}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.fachgebiet ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Auswählen</option>
                    {formData.fach && isFach(formData.fach) && Categories.fachgebiete[formData.fach]?.map((fachgebiet: string) => (
                      <option key={fachgebiet} value={fachgebiet}>{fachgebiet}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Thema
                    {errors.thema && <ErrorMessage message={errors.thema} />}
                  </label>
                  <select
                    name="thema"
                    value={formData.thema}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.thema ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Auswählen</option>
                    {formData.fachgebiet && isFachgebiet(formData.fachgebiet) && Categories.themen[formData.fachgebiet]?.map((thema: string) => (
                      <option key={thema} value={thema}>{thema}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center">
                    Kategorie
                    {errors.kategorie && <ErrorMessage message={errors.kategorie} />}
                  </label>
                  <select
                    name="kategorie"
                    value={formData.kategorie}
                    onChange={handleChange}
                    className={`w-full p-1.5 text-sm border rounded-md ${errors.kategorie ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Auswählen</option>
                    {kategorien.map(kategorie => (
                      <option key={kategorie} value={kategorie}>{kategorie}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Sections - More compact */}
            <div className="space-y-4"> {/* Reduced spacing between sections */}
              <FormSection
                title="Teil 1"
                teil={formData.teil1}
                teilName="teil1"
                colorScheme="blue"
                onTeilChange={handleTeilChange}
                onQuestionChange={(index, field, value) => handleQuestionChange('teil1', index, field, value)}
                onAddQuestion={() => addQuestion('teil1')}
                onDeleteQuestion={(index) => deleteQuestion('teil1', index)}
                template={generateMarkdownTemplates.teil1(formData)}
                onIndentation={(e, _, questionIndex, field) => handleIndentation(e, 'teil1', questionIndex, field)}
              />
              <FormSection
                title="Teil 2"
                teil={formData.teil2}
                teilName="teil2"
                colorScheme="green"
                onTeilChange={handleTeilChange}
                template={generateMarkdownTemplates.teil2(formData)}
                onIndentation={(e, _, questionIndex, field) => handleIndentation(e, 'teil2', questionIndex, field)}
              />
              <FormSection
                title="Teil 3"
                teil={formData.teil3}
                teilName="teil3"
                colorScheme="yellow"
                onTeilChange={handleTeilChange}
                onQuestionChange={(index, field, value) => handleQuestionChange('teil3', index, field, value)}
                onAddQuestion={() => addQuestion('teil3')}
                onDeleteQuestion={(index) => deleteQuestion('teil3', index)}
                template={generateMarkdownTemplates.teil3(formData)}
                onIndentation={(e, _, questionIndex, field) => handleIndentation(e, 'teil3', questionIndex, field)}
              />
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Zustätzliche Informationen</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  name="schlagwoerter" 
                  value={formData.schlagwoerter} 
                  onChange={handleChange} 
                  placeholder="Schlagwörter"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <select 
                  name="schwierigkeit" 
                  value={formData.schwierigkeit} 
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Schwierigkeitsgrad auswählen</option>
                  <option value="leicht">Leicht</option>
                  <option value="mittel">Mittel</option>
                  <option value="schwer">Schwer</option>
                </select>
                <input 
                  type="text" 
                  name="pruefungskompetenz" 
                  value={formData.pruefungskompetenz} 
                  onChange={handleChange} 
                  placeholder="Prüfungskompetenz"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <input 
                  type="text" 
                  name="verbundenThemen" 
                  value={formData.verbundenThemen} 
                  onChange={handleChange} 
                  placeholder="Verbundene Themen"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            {/* Action Buttons - More compact */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                type="button" 
                onClick={handleGenerateJSON} 
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300 flex items-center"
              >
                <Save className="mr-2" size={20} />
                {loading ? 'Wird generiert...' : 'JSON-Datei generieren'}
              </button>
              <button 
                type="button" 
                onClick={handleSaveDraft}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300 flex items-center"
              >
                <FileDown className="mr-2" size={20} />
                Entwurf speichern
              </button>
              <button 
                type="button" 
                onClick={loadDraft}
                className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600 transition duration-300 flex items-center"
              >
                <FileUp className="mr-2" size={20} />
                Entwurf laden
              </button>
              <button 
                type="button" 
                onClick={() => setAutoSave(!autoSave)}
                className={`flex items-center px-6 py-2 rounded-md transition duration-300 ${
                  autoSave 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gray-500 hover:bg-gray-600'
                } text-white`}
              >
                <Save className="mr-2" size={20} />
                Auto-Save: {autoSave ? 'An' : 'Aus'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Column - Show/Hide based on state */}
      {showPreview && (
        <div className="w-[40%] h-screen overflow-auto border-l bg-gray-50">
          <JSONPreview 
            data={formData}
            onCopy={() => {
              navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
            }}
          />
        </div>
      )}

      {/* Messages and Errors */}
      <div className="fixed bottom-4 right-4 space-y-2 max-w-md z-50">
        {message && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {message}
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium text-sm">Bitte korrigieren Sie folgende Fehler:</h3>
            <ul className="list-disc list-inside text-sm text-red-600">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// Create the main App component with routing
export default function App() {
  return (
    <BrowserRouter>
      <FormProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Generator />} />
            <Route path="preview" element={<PreviewPage />} />
          </Route>
        </Routes>
      </FormProvider>
    </BrowserRouter>
  );
}

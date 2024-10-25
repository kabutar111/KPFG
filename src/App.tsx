// Import necessary libraries and constants
import React, { useState, useEffect } from 'react';
import { Save, FileUp, FileDown, PlusCircle, Trash2 } from 'lucide-react'; // Added 'Trash2' icon
import { v4 as uuidv4 } from 'uuid';
import { Categories, isFach, isFachgebiet } from './categories'; // Adjusted the import path to match the correct casing
import { validateForm } from './utils/validators';
import { ErrorMessage } from './components/ErrorMessage';
import { AutoExpandingTextarea } from './components/AutoExpandingTextarea';
import { FachAbbreviations } from './utils/abbreviations';

// First, let's define some TypeScript interfaces
interface Teil {
  id: string;
  inhalt: string;
  schwierigkeit: string;
  questions?: Question[];
}

interface FormDataType {
  version: string; // Add this
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

// Add these interfaces at the top of App.tsx
interface Question {
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

export default function KPMedizinJSONGenerator() {
  const [formData, setFormData] = useState<FormDataType>({
    version: '1.0.0', // Add this
    id: '',
    state: '',
    examYear: '',
    examMonth: '',
    fach: '',
    fachgebiet: '',
    thema: '',
    kategorie: '',
    teil1: {
      id: uuidv4(),
      inhalt: '',
      schwierigkeit: '',
      questions: [{
        id: uuidv4(),
        fach: '',
        fachgebiet: '',
        thema: '',
        question: '',
        answer: '',
        idealAnswer: '',
        tags: [],
        schwierigkeit: '',
        kommentar: ''
      }]
    },
    teil2: {
      id: uuidv4(),
      inhalt: '',
      schwierigkeit: ''
    },
    teil3: {
      id: uuidv4(),
      inhalt: '',
      schwierigkeit: '',
      questions: [{
        id: uuidv4(),
        fach: '',
        fachgebiet: '',
        thema: '',
        question: '',
        answer: '',
        idealAnswer: '',
        tags: [],
        schwierigkeit: '',
        kommentar: ''
      }]
    },
    kommentar: '',
    schlagwoerter: '',
    schwierigkeit: '',
    pruefungskompetenz: '',
    verbundenThemen: ''
  });
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
      setFormData(prevData => ({ ...prevData, id: newId }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTeilChange = (teilName: keyof Pick<FormDataType, 'teil1' | 'teil2' | 'teil3'>, fieldName: keyof Teil, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [teilName]: {
        ...prevData[teilName],
        [fieldName]: value
      }
    }));
  };

  const handleQuestionChange = (teil: 'teil1' | 'teil3', index: number, field: keyof Question, value: string | string[]) => {
    const newQuestions = [...formData[teil].questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value
    };
    
    if (field === 'fach' || field === 'fachgebiet' || field === 'thema') {
      newQuestions[index] = updateQuestionTags(newQuestions[index]);
    }

    setFormData(prevData => ({
      ...prevData,
      [teil]: {
        ...prevData[teil],
        questions: newQuestions
      }
    }));
  };

  const addQuestion = (teil: 'teil1' | 'teil3') => {
    const lastQuestion = formData[teil].questions[formData[teil].questions.length - 1] || {};
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
    setFormData(prevData => ({
      ...prevData,
      [teil]: {
        ...prevData[teil],
        questions: [...prevData[teil].questions, newQuestion]
      }
    }));
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

  const handleGenerateJSON = () => {
    setLoading(true);
    setMessage('');
    
    try {
      // Validate required fields first
      const requiredFields = ['state', 'examYear', 'examMonth', 'fach', 'fachgebiet', 'thema', 'kategorie'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof FormDataType]);
      
      if (missingFields.length > 0) {
        setErrors(prev => ({
          ...prev,
          ...Object.fromEntries(missingFields.map(field => [field, `${field} ist ein Pflichtfeld`]))
        }));
        throw new Error('Bitte füllen Sie alle Pflichtfelder aus');
      }

      // Validate form data
      const { isValid, errors: validationErrors } = validateForm(formData);
      
      if (!isValid) {
        setMessage(validationErrors.join('\n'));
        return;
      }

      const fileName = generateFileName(formData);
      const jsonString = JSON.stringify(formData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.json`;
      link.click();
      setMessage('JSON-Datei erfolgreich generiert!');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Fehler beim Generieren der JSON-Datei');
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

  // Move generateFileName inside the component
  const generateFileName = (formData: FormDataType): string => {
    // Get unique fach values from all questions
    const allFachValues = new Set([
      ...formData.teil1.questions.map(q => q.fach),
      ...formData.teil3.questions.map(q => q.fach)
    ].filter(Boolean).slice(0, 3)); // Take first 3 unique non-empty values

    const components = {
      prefix: "KPM",
      state: formData.state.substring(0, 2).toUpperCase(),
      year: formData.examYear,
      month: formData.examMonth.padStart(2, '0'),
      faecher: Array.from(allFachValues)
        .map(fach => FachAbbreviations[fach] || fach.substring(0, 2).toUpperCase())
        .join('-'),
      sequence: sequenceNumber.toString().padStart(3, '0'),
      version: formData.version.replace(/\./g, '')
    };

    // Format: KPM_NW_2024_02_IM-CH-NE_001_v100
    return `${components.prefix}_${components.state}_${components.year}_${components.month}_${components.faecher}_${components.sequence}_v${components.version}`;
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">KP Medizin Prüfungsfragen-Generator</h2>
      <form className="space-y-8">
        {/* Basic Form Fields */}
        <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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

        {/* Teil 1 */}
        <div className="bg-blue-50 shadow-md rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-2xl font-semibold text-blue-800 mb-4">Teil 1</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Inhalt</label>
            <AutoExpandingTextarea
              value={formData.teil1.inhalt}
              onChange={(e) => handleTeilChange('teil1', 'inhalt', e.target.value)}
              placeholder="Beschreiben Sie den Fall oder die Situation"
              minRows={2}
              maxRows={8}
            />
          </div>
          <select
            value={formData.teil1.schwierigkeit}
            onChange={(e) => handleTeilChange('teil1', 'schwierigkeit', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">Schwierigkeitsgrad auswählen</option>
            <option value="leicht">Leicht</option>
            <option value="mittel">Mittel</option>
            <option value="schwer">Schwer</option>
          </select>
          {formData.teil1.questions.map((q, index) => (
            <div key={q.id} className="bg-white p-4 rounded-md shadow mb-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-blue-600 mb-2">Frage {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => deleteQuestion('teil1', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={q.fach}
                  onChange={(e) => handleQuestionChange('teil1', index, 'fach', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Fach auswählen</option>
                  {faecher.map(fach => (
                    <option key={fach} value={fach}>{fach}</option>
                  ))}
                </select>
                <select
                  value={q.fachgebiet}
                  onChange={(e) => handleQuestionChange('teil1', index, 'fachgebiet', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Fachgebiet auswählen</option>
                  {q.fach && isFach(q.fach) && Categories.fachgebiete[q.fach]?.map((fachgebiet: string) => (
                    <option key={fachgebiet} value={fachgebiet}>{fachgebiet}</option>
                  ))}
                </select>
                <select
                  value={q.thema}
                  onChange={(e) => handleQuestionChange('teil1', index, 'thema', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Thema auswählen</option>
                  {q.fachgebiet && isFachgebiet(q.fachgebiet) && Categories.themen[q.fachgebiet]?.map((thema: string) => (
                    <option key={thema} value={thema}>{thema}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Frage</label>
                  <AutoExpandingTextarea
                    value={q.question}
                    onChange={(e) => handleQuestionChange('teil1', index, 'question', e.target.value)}
                    placeholder="Formulieren Sie hier Ihre Frage"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Antwort</label>
                  <AutoExpandingTextarea
                    value={q.answer}
                    onChange={(e) => handleQuestionChange('teil1', index, 'answer', e.target.value)}
                    placeholder="Geben Sie hier die erwartete Antwort ein"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ideale Antwort</label>
                  <AutoExpandingTextarea
                    value={q.idealAnswer}
                    onChange={(e) => handleQuestionChange('teil1', index, 'idealAnswer', e.target.value)}
                    placeholder="Beschreiben Sie die Musterlösung"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kommentar
                    <span className="text-gray-500 text-sm ml-2">(Tipps und Hinweise)</span>
                  </label>
                  <AutoExpandingTextarea
                    value={q.kommentar}
                    onChange={(e) => handleQuestionChange('teil1', index, 'kommentar', e.target.value)}
                    placeholder="Fügen Sie hier hilfreiche Tipps, Literaturhinweise oder zusätzliche Erklärungen hinzu"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {q.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={q.tags.join(', ')}
                    onChange={(e) => handleQuestionChange('teil1', index, 'tags', e.target.value.split(',').map(tag => tag.trim()))}
                    placeholder="Zusatzliche Tags (durch Komma getrennt)"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <select
                value={q.schwierigkeit}
                onChange={(e) => handleQuestionChange('teil1', index, 'schwierigkeit', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Schwierigkeitsgrad auswählen</option>
                <option value="leicht">Leicht</option>
                <option value="mittel">Mittel</option>
                <option value="schwer">Schwer</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addQuestion('teil1')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            <PlusCircle className="inline-block mr-2" size={20} />
            Weitere Frage hinzufügen
          </button>
        </div>

        {/* Teil 2 */}
        <div className="bg-green-50 shadow-md rounded-lg p-6 border-l-4 border-green-500">
          <h3 className="text-2xl font-semibold text-green-800 mb-4">Teil 2</h3>
          <AutoExpandingTextarea
            name="inhalt"
            value={formData.teil2.inhalt}
            onChange={(e) => handleTeilChange('teil2', 'inhalt', e.target.value)}
            placeholder="Beschreiben Sie die Untersuchungsergebnisse oder Befunde"
            minRows={4}
            maxRows={8}
          />
          <select
            value={formData.teil2.schwierigkeit}
            onChange={(e) => handleTeilChange('teil2', 'schwierigkeit', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Schwierigkeitsgrad auswählen</option>
            <option value="leicht">Leicht</option>
            <option value="mittel">Mittel</option>
            <option value="schwer">Schwer</option>
          </select>
        </div>

        {/* Teil 3 */}
        <div className="bg-yellow-50 shadow-md rounded-lg p-6 border-l-4 border-yellow-500">
          <h3 className="text-2xl font-semibold text-yellow-800 mb-4">Teil 3</h3>
          <AutoExpandingTextarea
            name="inhalt"
            value={formData.teil3.inhalt}
            onChange={(e) => handleTeilChange('teil3', 'inhalt', e.target.value)}
            placeholder="Teil 3 Inhalt"
            minRows={4}
            maxRows={8}
          />
          <select
            value={formData.teil3.schwierigkeit}
            onChange={(e) => handleTeilChange('teil3', 'schwierigkeit', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
          >
            <option value="">Schwierigkeitsgrad auswählen</option>
            <option value="leicht">Leicht</option>
            <option value="mittel">Mittel</option>
            <option value="schwer">Schwer</option>
          </select>
          {formData.teil3.questions.map((q, index) => (
            <div key={q.id} className="bg-white p-4 rounded-md shadow mb-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-yellow-600 mb-2">Frage {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => deleteQuestion('teil3', index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={q.fach}
                  onChange={(e) => handleQuestionChange('teil3', index, 'fach', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Fach auswählen</option>
                  {faecher.map(fach => (
                    <option key={fach} value={fach}>{fach}</option>
                  ))}
                </select>
                <select
                  value={q.fachgebiet}
                  onChange={(e) => handleQuestionChange('teil3', index, 'fachgebiet', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Fachgebiet auswählen</option>
                  {q.fach && isFach(q.fach) && Categories.fachgebiete[q.fach]?.map((fachgebiet: string) => (
                    <option key={fachgebiet} value={fachgebiet}>{fachgebiet}</option>
                  ))}
                </select>
                <select
                  value={q.thema}
                  onChange={(e) => handleQuestionChange('teil3', index, 'thema', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Thema auswählen</option>
                  {q.fachgebiet && isFachgebiet(q.fachgebiet) && Categories.themen[q.fachgebiet]?.map((thema: string) => (
                    <option key={thema} value={thema}>{thema}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Frage</label>
                  <AutoExpandingTextarea
                    value={q.question}
                    onChange={(e) => handleQuestionChange('teil3', index, 'question', e.target.value)}
                    placeholder="Formulieren Sie hier Ihre Frage"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Antwort</label>
                  <AutoExpandingTextarea
                    value={q.answer}
                    onChange={(e) => handleQuestionChange('teil3', index, 'answer', e.target.value)}
                    placeholder="Geben Sie hier die erwartete Antwort ein"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Ideale Antwort</label>
                  <AutoExpandingTextarea
                    value={q.idealAnswer}
                    onChange={(e) => handleQuestionChange('teil3', index, 'idealAnswer', e.target.value)}
                    placeholder="Beschreiben Sie die Musterlösung"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kommentar
                    <span className="text-gray-500 text-sm ml-2">(Tipps und Hinweise)</span>
                  </label>
                  <AutoExpandingTextarea
                    value={q.kommentar}
                    onChange={(e) => handleQuestionChange('teil3', index, 'kommentar', e.target.value)}
                    placeholder="Fügen Sie hier hilfreiche Tipps, Literaturhinweise oder zusätzliche Erklärungen hinzu"
                    minRows={2}
                    maxRows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {q.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={q.tags.join(', ')}
                    onChange={(e) => handleQuestionChange('teil3', index, 'tags', e.target.value.split(',').map(tag => tag.trim()))}
                    placeholder="Zusatzliche Tags (durch Komma getrennt)"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <select
                value={q.schwierigkeit}
                onChange={(e) => handleQuestionChange('teil3', index, 'schwierigkeit', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Schwierigkeitsgrad auswählen</option>
                <option value="leicht">Leicht</option>
                <option value="mittel">Mittel</option>
                <option value="schwer">Schwer</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addQuestion('teil3')}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
          >
            <PlusCircle className="inline-block mr-2" size={20} />
            Weitere Frage hinzufügen
          </button>
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

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
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
        </div>
      </form>

      {message && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
          {message}
        </div>
      )}

      {/* Error Summary at the top if needed */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <h3 className="text-red-800 font-medium text-sm mb-2">Bitte korrigieren Sie folgende Fehler:</h3>
          <ul className="list-disc list-inside text-sm text-red-600">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

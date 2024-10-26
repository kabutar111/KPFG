import { useLocation, useNavigate } from 'react-router-dom';
import { JSONPreview } from '../components/JSONPreview';
import { FormDataType } from '../App';
import { useEffect } from 'react';
import { useForm } from '../context/FormContext';

export function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData } = useForm();

  // Create a default empty form data structure
  const defaultFormData: FormDataType = {
    version: '1.0.0',
    id: '',
    state: '',
    examYear: '',
    examMonth: '',
    fach: '',
    fachgebiet: '',
    thema: '',
    kategorie: '',
    teil1: {
      id: '',
      inhalt: '',
      schwierigkeit: '',
      questions: []
    },
    teil2: {
      id: '',
      inhalt: '',
      schwierigkeit: ''
    },
    teil3: {
      id: '',
      inhalt: '',
      schwierigkeit: '',
      questions: []
    },
    kommentar: '',
    schlagwoerter: '',
    schwierigkeit: '',
    pruefungskompetenz: '',
    verbundenThemen: ''
  };

  // Use the form data if available, otherwise use default
  const dataToDisplay = formData || defaultFormData;

  // Add effect to maintain data when switching back to generator
  useEffect(() => {
    if (formData) {
      navigate('/preview', { state: { formData }, replace: true });
    }
  }, [formData, navigate]);

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="h-[calc(100vh-8rem)]">
        <JSONPreview 
          data={dataToDisplay}
          onCopy={() => {
            navigator.clipboard.writeText(JSON.stringify(dataToDisplay, null, 2));
          }}
        />
      </div>
    </div>
  );
}

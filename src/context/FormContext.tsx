import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { FormDataType } from '../App';
import { v4 as uuidv4 } from 'uuid';

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
};

interface FormContextType {
  formData: FormDataType;
  setFormData: Dispatch<SetStateAction<FormDataType>>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormDataType>(defaultFormData);

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
}

export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

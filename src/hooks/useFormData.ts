import { useState, useEffect } from 'react';
import { FormDataType, Question } from '../App';
import { v4 as uuidv4 } from 'uuid';

export function useFormData() {
  const [formData, setFormData] = useState<FormDataType>({
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
      questions: [createEmptyQuestion()]
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
      questions: [createEmptyQuestion()]
    },
    kommentar: '',
    schlagwoerter: '',
    schwierigkeit: '',
    pruefungskompetenz: '',
    verbundenThemen: ''
  });

  function createEmptyQuestion(): Question {
    return {
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
    };
  }

  // Add your form handling functions here
  // handleChange, handleTeilChange, handleQuestionChange, etc.

  return {
    formData,
    setFormData,
    // Export other functions
  };
}

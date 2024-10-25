import { z } from "zod";
import { Categories } from "../categories";
import type { FormDataType } from "../App";

// Basic validation schemas
export const SchwierigkeitSchema = z.enum(["leicht", "mittel", "schwer"]);

export const CategoryValidators = {
  validateState: (state: string): boolean => {
    return Categories.germanStates.includes(state);
  },

  validateFach: (fach: string): boolean => {
    return Categories.faecher.includes(fach);
  },

  validateFachgebiet: (fach: string, fachgebiet: string): boolean => {
    if (!Categories.fachgebiete[fach]) return false;
    return Categories.fachgebiete[fach].includes(fachgebiet);
  },

  validateThema: (fachgebiet: string, thema: string): boolean => {
    if (!Categories.themen[fachgebiet]) return false;
    return Categories.themen[fachgebiet].includes(thema);
  },

  validateKategorie: (kategorie: string): boolean => {
    return Categories.kategorien.includes(kategorie);
  },

  validateSchwierigkeit: (schwierigkeit: string): boolean => {
    return ["leicht", "mittel", "schwer"].includes(schwierigkeit);
  }
};

// Validation error messages
export const ValidationMessages = {
  state: "Bitte wählen Sie ein gültiges Bundesland aus.",
  fach: "Bitte wählen Sie ein gültiges Fach aus.",
  fachgebiet: "Bitte wählen Sie ein gültiges Fachgebiet für das ausgewählte Fach aus.",
  thema: "Bitte wählen Sie ein gültiges Thema für das ausgewählte Fachgebiet aus.",
  kategorie: "Bitte wählen Sie eine gültige Kategorie aus.",
  schwierigkeit: "Bitte wählen Sie einen gültigen Schwierigkeitsgrad aus.",
  required: (field: string) => `${field} ist erforderlich.`
};

// Main validation function
export const validateForm = (formData: FormDataType): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields validation
  if (!formData.state) errors.push(ValidationMessages.required("Bundesland"));
  if (!formData.examYear) errors.push(ValidationMessages.required("Prüfungsjahr"));
  if (!formData.examMonth) errors.push(ValidationMessages.required("Prüfungsmonat"));
  if (!formData.fach) errors.push(ValidationMessages.required("Fach"));

  // Category validations
  if (formData.state && !CategoryValidators.validateState(formData.state)) {
    errors.push(ValidationMessages.state);
  }

  if (formData.fach && !CategoryValidators.validateFach(formData.fach)) {
    errors.push(ValidationMessages.fach);
  }

  if (formData.fach && formData.fachgebiet && 
      !CategoryValidators.validateFachgebiet(formData.fach, formData.fachgebiet)) {
    errors.push(ValidationMessages.fachgebiet);
  }

  if (formData.fachgebiet && formData.thema && 
      !CategoryValidators.validateThema(formData.fachgebiet, formData.thema)) {
    errors.push(ValidationMessages.thema);
  }

  if (formData.kategorie && !CategoryValidators.validateKategorie(formData.kategorie)) {
    errors.push(ValidationMessages.kategorie);
  }

  // Validate questions in Teil 1 and Teil 3
  ['teil1', 'teil3'].forEach((teil: 'teil1' | 'teil3') => {
    formData[teil].questions.forEach((question, index) => {
      if (!question.question) {
        errors.push(`Frage ${index + 1} in Teil ${teil === 'teil1' ? '1' : '3'}: Fragetext ist erforderlich`);
      }
      if (!question.answer) {
        errors.push(`Frage ${index + 1} in Teil ${teil === 'teil1' ? '1' : '3'}: Antwort ist erforderlich`);
      }
      if (question.schwierigkeit && !CategoryValidators.validateSchwierigkeit(question.schwierigkeit)) {
        errors.push(`Frage ${index + 1} in Teil ${teil === 'teil1' ? '1' : '3'}: ${ValidationMessages.schwierigkeit}`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

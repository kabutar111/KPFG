export interface Question {
  fach: string;
  fachgebiet: string;
  thema: string;
  question: string;
  answer: string;
  tags: string;
}

export interface FormData {
  id: string;
  state: string;
  examYear: string;
  examMonth: string;
  fach: string;
  fachgebiet: string;
  thema: string;
  kategorie: string;
  teil1Inhalt: string;
  questionsTeil1: Question[];
  kommentar: string;
  teil2Inhalt: string;
  questionsTeil3: Question[];
  schlagwoerter: string;
  schwierigkeit: string;
  pruefungskompetenz: string;
  verbundenThemen: string;
}
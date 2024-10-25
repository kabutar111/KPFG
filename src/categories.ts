import React from 'react';

// First, let's define proper types for our category structures
export interface CategoryStructure {
  germanStates: readonly string[];
  faecher: readonly string[];
  fachgebiete: {
    readonly [key in "Innere Medizin" | "Chirurgie" | "Allgemeinmedizin"]: readonly string[];
  };
  themen: {
    readonly [key in "Kardiologie" | "Angiologie" | "Pneumologie" | "Gastroenterologie"]: readonly string[];
  };
  kategorien: readonly string[];
  schwierigkeitsgrade: readonly string[];
  pruefungskompetenzen: readonly string[];
}

// Then export our categories with proper typing
export const Categories: CategoryStructure = {
  germanStates: [
    "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
    "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
    "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
    "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
  ],

  faecher: [
    "Innere Medizin",
    "Chirurgie",
    "Allgemeinmedizin",
    // Additional subjects from the document
    "Orthopädie",
    "Neurologie",
    "Psychiatrie",
    "Gynäkologie",
    "Pädiatrie",
    "Urologie",
    "Dermatologie",
    "Augenheilkunde",
    "HNO",
    "Anästhesiologie"
  ],

  fachgebiete: {
    "Innere Medizin": [
      "Kardiologie",
      "Angiologie",
      "Pneumologie",
      "Hämatologie",
      "Onkologie",
      "Gastroenterologie",
      "Endokrinologie",
      "Nephrologie",
      "Rheumatologie",
      "Infektiologie"
    ],
    "Chirurgie": [
      "Allgemeinchirurgie",
      "Viszeralchirurgie",
      "Unfallchirurgie",
      "Orthopädie",
      "Thoraxchirurgie",
      "Gefäßchirurgie"
    ],
    "Allgemeinmedizin": [
      "Hausärztliche Versorgung",
      "Prävention",
      "Geriatrie"
    ],
    // Add other specialties as needed
  },

  themen: {
    "Kardiologie": [
      "Arterielle Hypertonie",
      "Koronare Herzkrankheit",
      "Akutes Koronarsyndrom",
      "Myokardinfarkt",
      "Herzkatheteruntersuchung",
      "Sick-Sinus-Syndrom",
      "Vorhofflimmern",
      "AV-Block",
      "Ventrikuläre Tachykardie",
      "Kammerflattern und -flimmern",
      "Herzschrittmacher",
      "Infektiöse Endokarditis",
      "Rheumatisches Fieber",
      "Herzinsuffizienz"
    ],
    "Angiologie": [
      "Phlebothrombose",
      "Lungenembolie",
      "Periphere arterielle Verschlusskrankheit"
    ],
    "Pneumologie": [
      "Akute Bronchitis",
      "Pneumonie",
      "Asthma bronchiale",
      "Chronisch obstruktive Lungenerkrankung",
      "Lungenkarzinom",
      "Pleuraerguss",
      "Tuberkulose"
    ],
    "Gastroenterologie": [
      "Gastroösophageale Refluxkrankheit",
      "Chronische Gastritis",
      "Gastroduodenale Ulkuskrankheit",
      "Gastrointestinale Blutung",
      "Morbus Crohn",
      "Colitis ulcerosa",
      "Glutensensitive Enteropathie",
      "Leberzirrhose",
      "Portale Hypertension",
      "Aszites",
      "Akute Pankreatitis",
      "Chronische Pankreatitis",
      "Pankreaskarzinom"
    ],
    // Add other themes for each specialty
  },

  kategorien: [
    "Mündliche Prüfung",
    "Schriftliche Prüfung",
    "OSCE",
    "Praktische Prüfung",
    "Fallbesprechung",
    "Differentialdiagnose"
  ],

  schwierigkeitsgrade: [
    "leicht",
    "mittel",
    "schwer"
  ],

  pruefungskompetenzen: [
    "Diagnostik",
    "Therapie",
    "Notfallmanagement",
    "Kommunikation",
    "Patientenführung",
    "Medizinische Expertise",
    "Wissenschaftliche Grundlagen"
  ],

  klinischeSkills: [
    "Anamnese",
    "Körperliche Untersuchung",
    "Apparative Untersuchungen",
    "Leitsymptome",
    "Grundlagen des ärztlichen Handelns"
  ],

  untersuchungsmethoden: [
    "EKG",
    "Lungenfunktionsuntersuchung",
    "Laboratoriumsmedizin",
    "Pulsoxymetrie und Blutgasanalyse",
    "Befundung eines Röntgen-Thorax",
    "Sonographie",
    "Computertomographie",
    "Magnetresonanztomographie"
  ],

  leitsymptome: [
    "Thoraxschmerz",
    "Kopfschmerzen",
    "Akutes Abdomen",
    "Durchfall",
    "Obstipation",
    "Husten",
    "Ikterus und Cholestase",
    "Kreuzschmerz",
    "Lymphknotenschwellung",
    "Ödeme",
    "Synkope",
    "Schwindel",
    "Dyspnoe"
  ],

  grundlagenAerztlichesHandeln: [
    "Ärztliche Rechtskunde",
    "Arzneimittelrezept",
    "Transfusionen",
    "Thanatologie",
    "Soziale Sicherung",
    "Prävention",
    "Rehabilitation",
    "Behinderung und Einschränkung der Arbeitsfähigkeit",
    "Ökonomische Aspekte von Gesundheit und Krankheit"
  ],

  notfallUndIntensivmedizin: [
    "Rettungsablauf am Unfallort und klinische Primärversorgung",
    "Reanimation",
    "Schock",
    "Anaphylaxie",
    "Hyperglykämisches Koma",
    "Hypoglykämie",
    "Perikarderguss"
  ]
};

// Add type guards to ensure type safety
export const isFach = (fach: string): fach is keyof typeof Categories.fachgebiete => {
  return Object.keys(Categories.fachgebiete).includes(fach);
};

export const isFachgebiet = (fachgebiet: string): fachgebiet is keyof typeof Categories.themen => {
  return Object.keys(Categories.themen).includes(fachgebiet);
};

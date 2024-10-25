import { Timestamp } from 'firebase/firestore';

// Core types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

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
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User progress tracking
export interface UserProgress {
  userId: string;
  questionId: string;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  timeSpent: number;
  lastAttempted: Timestamp;
  markedForReview: boolean;
  isFavorite: boolean;
  notes: string;
}

// Media attachments
export interface QuestionMedia {
  questionId: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  description: string;
  createdAt: Timestamp;
}

// Study sessions
export interface StudySession {
  userId: string;
  startTime: Timestamp;
  endTime: Timestamp;
  questionsAttempted: string[]; // Array of question IDs
  correctAnswers: number;
  topics: string[];
}

// Firestore collection names
export const collections = {
  users: 'users',
  questions: 'questions',
  userProgress: 'userProgress',
  questionMedia: 'questionMedia',
  studySessions: 'studySessions'
} as const;

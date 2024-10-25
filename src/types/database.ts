// User related types
interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'student' | 'instructor' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Question from JSON generator
interface BaseQuestion {
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

// User interaction data stored separately
interface QuestionProgress {
  id: string;
  userId: string;
  questionId: string;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  timeSpent: number;
  lastAttempted: Date;
  markedForReview: boolean;
  isFavorite: boolean;
  userNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

// Media attachments stored separately
interface QuestionMedia {
  id: string;
  questionId: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  description: string;
  createdAt: Date;
}

// Related content stored separately
interface QuestionRelations {
  id: string;
  sourceQuestionId: string;
  targetQuestionId: string;
  relationType: 'similar' | 'prerequisite' | 'followUp';
  createdAt: Date;
}

// Study sessions
interface StudySession {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  questionsAttempted: number;
  correctAnswers: number;
  topics: string[];
}

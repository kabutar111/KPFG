import { db } from './config';
import { collections } from './schema';
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import type { Question, UserProgress } from './schema';

export const saveQuestion = async (question: Question) => {
  const ref = doc(db, collections.questions, question.id);
  await setDoc(ref, question);
};

export const getUserProgress = async (userId: string, questionId: string) => {
  const ref = doc(db, collections.userProgress, `${userId}_${questionId}`);
  const snap = await getDoc(ref);
  return snap.data() as UserProgress;
};

export const updateUserProgress = async (progress: UserProgress) => {
  const ref = doc(db, collections.userProgress, `${progress.userId}_${progress.questionId}`);
  await updateDoc(ref, progress);
};

import { openDatabase } from './database';

export interface Question {
  id: number;
  content: string;
  options: string;
  correctAnswerIndex: number;
  isCritical: number;
  number: number;
  imageName: string;
  chapterId: number;
}

export async function getAllQuestions(): Promise<Question[]> {
  const db = await openDatabase();
  return db.getAllAsync<Question>('SELECT * FROM questions');
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const db = await openDatabase();
  return db.getFirstAsync<Question>('SELECT * FROM questions WHERE id = ?', id);
}
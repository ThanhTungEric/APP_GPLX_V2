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
  explain?: string;
}

export interface License_Question {
  id: number;
  licenseId: number;
  questionId: number;
}

export async function getQuestionsByLicense(licenseId: number): Promise<Question[]> {
  const db = await openDatabase();
  const result = await db.getAllAsync<Question>(
    `SELECT q.* FROM questions q
     JOIN question_licenses ql ON q.id = ql.questionId
     WHERE ql.licenseId = ?`,
    licenseId
  );
  return result;
}

export async function getAllQuestions(): Promise<Question[]> {
  const db = await openDatabase();
  return db.getAllAsync<Question>('SELECT * FROM questions');
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const db = await openDatabase();
  return db.getFirstAsync<Question>('SELECT * FROM questions WHERE id = ?', id);
}

export async function getQuestionsByChapter(chapterId: number): Promise<Question[]> {
  const db = await openDatabase();
  return db.getAllAsync<Question>(
    'SELECT * FROM questions WHERE chapterId = ?',
    chapterId
  );
}

export async function getQuestionCountsByChapter(): Promise<{ chapterId: number; questionCount: number }[]> {
  const db = await openDatabase();
  return db.getAllAsync<{ chapterId: number; questionCount: number }>(
    `SELECT chapterId, COUNT(*) as questionCount
     FROM questions
     GROUP BY chapterId`
  );
}

export async function getCriticalQuestions(): Promise<Question[]> {
  const db = await openDatabase();
  return db.getAllAsync<Question>(
    'SELECT * FROM questions WHERE isCritical = 1'
  );
}

export async function getQuestionCountsByChapterAndLicense(): Promise<{ chapterId: number; licenseId: number; questionCount: number }[]> {
  const db = await openDatabase();
  return db.getAllAsync<{ chapterId: number; licenseId: number; questionCount: number }>(
    `SELECT q.chapterId, ql.licenseId, COUNT(*) as questionCount
     FROM questions q
     JOIN question_licenses ql ON q.id = ql.questionId
     GROUP BY q.chapterId, ql.licenseId`
  );
}

export async function getQuestionsByChapterAndLicense(chapterId: number, licenseId: number): Promise<Question[]> {
  const db = await openDatabase();
  return db.getAllAsync<Question>(
    `SELECT q.* FROM questions q
     JOIN question_licenses ql ON q.id = ql.questionId
     WHERE q.chapterId = ? AND ql.licenseId = ?`,
    chapterId,
    licenseId
  );
}
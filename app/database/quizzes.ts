import { openDatabase } from './database';
import * as SQLite from 'expo-sqlite';


interface License {
    id: number;
    name: string;
    description: string;
}

interface Question {
    id: number;
    content: string;
    options: string[];
    correctAnswerIndex: number;
    isCritical: boolean;
    number: number;
    imageName: string;
    chapterId: number;
}

interface Quiz {
    id: number;
    name: string;
    licenseId: number;
}

export async function getAllQuizzes(): Promise<Quiz[]> {
    const db = await openDatabase();
    const query = 'SELECT * FROM quizzes';
    return db.getAllAsync<Quiz>(query);
}

export async function getQuizzesByLicense(licenseId: number): Promise<(Quiz & { licenseName: string })[]> {
    const db = await openDatabase();
    const query = `
      SELECT q.*, l.name as licenseName 
      FROM quizzes q
      JOIN licenses l ON q.licenseId = l.id
      WHERE q.licenseId = ?
    `;
    return db.getAllAsync<Quiz & { licenseName: string }>(query, licenseId);
}

export async function getQuestionsByQuiz(quizId: number): Promise<Question[]> {
    const db = await openDatabase();
    const query = `
      SELECT q.* FROM questions q
      JOIN quiz_questions qq ON q.id = qq.questionId
      WHERE qq.quizId = ?
    `;
    return db.getAllAsync<Question>(query, quizId);
}
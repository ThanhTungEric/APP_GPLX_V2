import { openDatabase } from './database';
export interface SavedQuestion {
    id: number;
    questionId: number;
    answer: string | null;
}
export async function insertSavedQuestion(questionId: number): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
        `INSERT INTO save_question (questionId) VALUES (?);`,
        questionId
    );
}
export async function updateAnswerForQuestion(questionId: number, answer: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
        `UPDATE save_question SET answer = ? WHERE questionId = ?;`,
        answer,
        questionId
    );
}

export async function deleteSavedQuestionById(id: number): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(`DELETE FROM save_question WHERE id = ?;`, id);
}
export async function getAllSavedQuestions(): Promise<SavedQuestion[]> {
    const db = await openDatabase();
    return db.getAllAsync<SavedQuestion>('SELECT * FROM save_question;');
}
export async function getSavedQuestionByQuestionId(questionId: number): Promise<SavedQuestion | null> {
    const db = await openDatabase();
    return db.getFirstAsync<SavedQuestion>(
        'SELECT * FROM save_question WHERE questionId = ?',
        questionId
    );
}

import { openDatabase } from './database';
export interface SavedQuestion {
    id: number;
    questionId: number;
    answer: string | null;
}
export async function insertSavedQuestion(questionId: number): Promise<void> {
    console.log("vưa án lưu câu hỏi", questionId);
    const db = await openDatabase();
    await db.runAsync(
        `INSERT INTO saveQuestion (questionId) VALUES (?);`,
        questionId
    );

}
export async function updateAnswerForQuestion(questionId: number, answer: string): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(
        `UPDATE saveQuestion SET answer = ? WHERE questionId = ?;`,
        answer,
        questionId
    );
}
export async function deleteSavedQuestionById(id: number): Promise<void> {
    const db = await openDatabase();
    await db.runAsync(`DELETE FROM saveQuestion WHERE id = ?;`, id);
}
export async function getAllSavedQuestions(): Promise<SavedQuestion[]> {
    const db = await openDatabase();
    return db.getAllAsync<SavedQuestion>('SELECT * FROM saveQuestion;');
}
export async function getSavedQuestionByQuestionId(questionId: number): Promise<SavedQuestion | null> {
    const db = await openDatabase();
    return db.getFirstAsync<SavedQuestion>(
        'SELECT * FROM saveQuestion WHERE questionId = ?',
        questionId
    );
}

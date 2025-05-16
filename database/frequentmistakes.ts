import { openDatabase } from './database';

export interface FrequentMistake {
    id: number;
    questionId: number;
    mistakeCount: number;
    lastMistakeTimestamp: string;
}

export async function getFrequentMistakes(): Promise<(FrequentMistake & { content: string; options: string; correctAnswerIndex: number; imageName?: string })[]> {
    const db = await openDatabase();
    try {
        const result = await db.getAllAsync<FrequentMistake & { content: string; options: string; correctAnswerIndex: number; imageName?: string }>(
            `SELECT fm.*, q.content, q.options, q.correctAnswerIndex, q.imageName
             FROM frequentmistakes fm
             JOIN questions q ON fm.questionId = q.id
             ORDER BY fm.mistakeCount DESC, fm.lastMistakeTimestamp DESC`
        );

        return result.map(row => ({
            ...row,
            options: row.options || '', // Ensure options is a string
        }));
    } catch (error) {
        console.error('Error fetching frequent mistakes:', error);
        return [];
    }
}

// Thêm hoặc cập nhật thông tin câu hỏi hay sai
export async function saveFrequentMistake(questionId: number): Promise<void> {
    const db = await openDatabase();
    try {
        const existing = await db.getFirstAsync<FrequentMistake>(
            `SELECT * FROM frequentmistakes WHERE questionId = ?`,
            questionId
        );

        if (existing) {
            // Increment mistakeCount if the question already exists
            await db.runAsync(
                `UPDATE frequentmistakes 
                 SET mistakeCount = mistakeCount + 1, 
                     lastMistakeTimestamp = CURRENT_TIMESTAMP 
                 WHERE questionId = ?`,
                questionId
            );
        } else {
            // Insert a new entry if the question does not exist
            await db.runAsync(
                `INSERT INTO frequentmistakes (questionId, mistakeCount, lastMistakeTimestamp) 
                 VALUES (?, 1, CURRENT_TIMESTAMP)`,
                questionId
            );
        }
    } catch (error) {
        console.error('Error saving frequent mistake:', error);
    }
}

// Xóa thông tin câu hỏi hay sai
export async function clearFrequentMistake(questionId: number): Promise<void> {
    const db = await openDatabase();
    try {
        await db.runAsync(`DELETE FROM frequentmistakes WHERE questionId = ?`, questionId);
    } catch (error) {
        console.error('Error clearing frequent mistake:', error);
    }
}

// Xóa toàn bộ thông tin câu hỏi hay sai
export async function clearAllFrequentMistakes(): Promise<void> {
    const db = await openDatabase();
    try {
        await db.runAsync(`DELETE FROM frequentmistakes`);
    } catch (error) {
        console.error('Error clearing all frequent mistakes:', error);
    }
}

// Lấy thông tin câu hỏi hay sai theo ID
export async function getFrequentMistakeById(questionId: number): Promise<FrequentMistake | null> {
    const db = await openDatabase();
    try {
        const result = await db.getFirstAsync<FrequentMistake>(
            `SELECT * FROM frequentmistakes WHERE questionId = ?`,
            questionId
        );
        return result || null;
    } catch (error) {
        console.error('Error fetching frequent mistake by ID:', error);
        return null;
    }
}

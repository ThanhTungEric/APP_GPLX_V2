import { openDatabase } from './database';

export interface QuizHistory {
    id: number;
    quizId: number;
    correctCount: number;
    incorrectCount: number;
    passed: boolean;
    timestamp: string;
}

// Lấy lịch sử của một bài thi
export async function getQuizHistory(quizId: number): Promise<QuizHistory[]> {
    const db = await openDatabase();
    try {
        const result = await db.getAllAsync<QuizHistory>(
            `SELECT * FROM quizesshistory WHERE quizId = ? ORDER BY timestamp DESC`,
            quizId
        );
        return result;
    } catch (error) {
        console.error('Error fetching quiz history:', error);
        return [];
    }
}

// Lưu lịch sử bài thi
export async function saveQuizHistory(quizId: number, correctCount: number, incorrectCount: number, passed: boolean): Promise<void> {
    const db = await openDatabase();
    try {
        await db.runAsync(
            `INSERT INTO quizesshistory (quizId, correctCount, incorrectCount, passed) VALUES (?, ?, ?, ?)`,
            quizId,
            correctCount,
            incorrectCount,
            passed ? 1 : 0
        );
    } catch (error) {
        console.error('Error saving quiz history:', error);
    }
}

// Xóa lịch sử của một bài thi
export async function clearQuizHistory(quizId: number): Promise<void> {
    const db = await openDatabase();
    try {
        await db.runAsync(`DELETE FROM quizesshistory WHERE quizId = ?`, quizId);
    } catch (error) {
        console.error('Error clearing quiz history:', error);
    }
}

// Lấy toàn bộ lịch sử bài thi
export async function getAllQuizHistory(): Promise<QuizHistory[]> {
    const db = await openDatabase();
    try {
        const result = await db.getAllAsync<QuizHistory>(
            `SELECT * FROM quizesshistory ORDER BY timestamp DESC`
        );
        return result;
    } catch (error) {
        console.error('Error fetching all quiz history:', error);
        return [];
    }
}

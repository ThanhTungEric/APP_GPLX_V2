import { openDatabase } from './database';

export interface Chapter {
    id: number;
    name: string;
}

export async function getAllChapters(): Promise<Chapter[]> {
    const db = await openDatabase();
    return db.getAllAsync<Chapter>('SELECT * FROM chapters');
}

export async function getChaptersWithQuestionCounts(): Promise<(Chapter & { questionCount: number })[]> {
    const db = await openDatabase();
    const result = await db.getAllAsync<{ id: number; name: string; questionCount: number }>(
        `SELECT c.id, c.name, COUNT(q.id) as questionCount
     FROM chapters c
     LEFT JOIN questions q ON c.id = q.chapterId
     GROUP BY c.id, c.name`
    );
    return result;
}

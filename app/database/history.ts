import { openDatabase } from './database';
import { getLicenseIdByName } from './licenses';

export interface License {
    id: number;
    name: string;
    description: string;
}

//history is key valu
export interface History {
    id: number;
    key: string;
    value: string;
}

//set current License
export async function setLicense(value: string): Promise<void> {
    const db = await openDatabase();
    const key = 'current_license';
    const existingRecord = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM history WHERE key = ?',
        key
    );

    if (existingRecord) {
        await db.runAsync(
            'UPDATE history SET value = ?, createdAt = CURRENT_TIMESTAMP WHERE key = ?',
            value,
            key
        );
    } else {
        await db.runAsync(
            'INSERT INTO history (key, value) VALUES (?, ?)',
            key,
            value
        );
    }
}

export async function getCurrentLicense(): Promise<string | null> {
    const db = await openDatabase();
    const key = 'current_license';
    const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM history WHERE key = ?', key);
    return result?.value ?? null;
}

// get current license return id
export async function getCurrentLicenseId(): Promise<number | null> {
    const db = await openDatabase();
    const key = 'current_license';
    const result = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM history WHERE key = ?',
        key
    );

    if (!result) return null;

    return await getLicenseIdByName(result.value);
}
// create key grading_mode
export async function setGradingMode(value: string): Promise<void> {
    const db = await openDatabase();
    const key = 'grading_mode';
    const existingRecord = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM history WHERE key = ?',
        key
    );

    if (existingRecord) {
        await db.runAsync(
            'UPDATE history SET value = ?, createdAt = CURRENT_TIMESTAMP WHERE key = ?',
            value,
            key
        );
    } else {
        await db.runAsync(
            'INSERT INTO history (key, value) VALUES (?, ?)',
            key,
            value
        );
    }
}

export async function getGradingMode(): Promise<string | null> {
    const db = await openDatabase();
    const key = 'grading_mode';
    const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM history WHERE key = ?', key);
    return result?.value ?? null;
}

export async function resetHistory(): Promise<void> {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM history');
}
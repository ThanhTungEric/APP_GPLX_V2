import { openDatabase } from './database';
import { getLicenseIdByName } from './licenses';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const saveExamResult = async (result: {
    testName: string;
    correctCount: number;
    incorrectCount: number;
    totalQuestions: number;
    passed: boolean;
    timestamp: string;
}) => {
    try {
        const existingHistory = await AsyncStorage.getItem('examHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        history.push(result);
        await AsyncStorage.setItem('examHistory', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving exam result:', error);
    }
};

export const getExamHistory = async () => {
    try {
        const history = await AsyncStorage.getItem('examHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error fetching exam history:', error);
        return [];
    }
};

export const clearExamHistory = async () => {
    try {
        await AsyncStorage.removeItem('examHistory'); // Xóa dữ liệu trong AsyncStorage
        console.log('Exam history cleared successfully.');
    } catch (error) {
        console.error('Error clearing exam history:', error);
    }
};

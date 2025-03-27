import { openDatabase } from './database';

export interface License {
  id: number;
  name: string;
  description: string;
}

export async function getAllLicenses(): Promise<License[]> {
  const db = await openDatabase();
  return db.getAllAsync<License>('SELECT * FROM licenses');
}

export async function getLicenseById(id: number): Promise<License | null> {
  const db = await openDatabase();
  return db.getFirstAsync<License>('SELECT * FROM licenses WHERE id = ?', id);
}

// get license id by name
export async function getLicenseIdByName(name: string): Promise<number | null> {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM licenses WHERE name = ?',
    name
  );
  return result?.id ?? null;
}
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

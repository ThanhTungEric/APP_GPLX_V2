import * as SQLite from 'expo-sqlite';
import API from './API';

let db: SQLite.SQLiteDatabase | null = null;

interface Question {
  id: number;
  content: string;
  options: string;
  correctAnswerIndex: number;
  isCritical: number | boolean;
  number: number;
  imageName: string;
  chapterId: number;
}


export async function openDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('quiz.db');
  }
  return db;
}

// Tạo bảng
export async function createTables() {
  const db = await openDatabase();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS version (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT,
      value TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      options TEXT,
      correctAnswerIndex INTEGER,
      isCritical BOOLEAN,
      number INTEGER,
      imageName TEXT,
      chapterId INTEGER,
      FOREIGN KEY (chapterId) REFERENCES chapters(id)
    );

    CREATE TABLE IF NOT EXISTS question_licenses (
      questionId INTEGER,
      licenseId INTEGER,
      FOREIGN KEY (questionId) REFERENCES questions(id),
      FOREIGN KEY (licenseId) REFERENCES licenses(id),
      PRIMARY KEY (questionId, licenseId)
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE,
      licenseId INTEGER,
      FOREIGN KEY (licenseId) REFERENCES licenses(id)
    );
  `);
}

// Kiểm tra phiên bản
export async function checkVersion() {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ version: string }>(
    'SELECT version FROM version ORDER BY createdAt DESC LIMIT 1'
  );
  const versionInDB = result?.version || null;
  try {
    const fullURL = API.defaults.baseURL + 'versions/lastest';
    const response = await API.get('versions/lastest');
    const newVersion = response.data.version;
    if (newVersion !== versionInDB) {
      await updateDataFromAPI(newVersion);
    } else {
      console.log('👍 Dữ liệu đã là mới nhất!');
    }
  } catch (error) {
    console.error("❌ Lỗi khi lấy phiên bản từ API:", error);
  }
}


// Cập nhật dữ liệu
export async function updateDataFromAPI(newVersion: string) {
  const db = await openDatabase();

  try {
    const [chaptersRes, licensesRes, questionsRes, quizzesRes] = await Promise.all([
      API.get('/chapters'),
      API.get('/licenses'),
      API.get('/questions'),
      API.get('/quizzes'),
    ]);

    await db.withTransactionAsync(async () => {
      // Xóa dữ liệu cũ
      await db.runAsync('DELETE FROM chapters');
      await db.runAsync('DELETE FROM licenses');
      await db.runAsync('DELETE FROM questions');
      await db.runAsync('DELETE FROM quizzes');
      await db.runAsync('DELETE FROM question_licenses');

      // Thêm mới
      for (const chapter of chaptersRes.data) {
        await db.runAsync('INSERT INTO chapters (name) VALUES (?)', chapter.name);
      }

      for (const license of licensesRes.data) {
        await db.runAsync(
          'INSERT INTO licenses (name, description) VALUES (?, ?)',
          license.name,
          license.description
        );
      }

      for (const q of questionsRes.data) {
        await db.runAsync(
          `INSERT INTO questions (content, options, correctAnswerIndex, isCritical, number, imageName, chapterId)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          q.content,
          JSON.stringify(q.options),
          q.correctAnswerIndex,
          q.isCritical,
          q.number,
          q.imageName,
          q.chapter.id
        );


        for (const license of q.licenses) {
          await db.runAsync(
            'INSERT INTO question_licenses (questionId, licenseId) VALUES (?, ?)',
            q.id,
            license.id
          );
        }
      }

      for (const quiz of quizzesRes.data) {
        await db.runAsync(
          'INSERT INTO quizzes (name, licenseId) VALUES (?, ?)',
          quiz.name,
          quiz.licenseId
        );
      }

      await db.runAsync('INSERT INTO version (version) VALUES (?)', newVersion);
    });
  } catch (error) {
    console.error('Lỗi khi cập nhật dữ liệu từ API:', error);
  }
}

// Ghi lịch sử
export async function logHistory(key: string, value: string) {
  const db = await openDatabase();
  await db.runAsync('INSERT INTO history (key, value) VALUES (?, ?)', key, value);
}

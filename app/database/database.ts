import * as SQLite from 'expo-sqlite';
import API from './API';

let db: SQLite.SQLiteDatabase | null = null;

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
      id INTEGER,
      key TEXT,
      value TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER,
      name TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS licenses (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      description TEXT,
      totalQuestions INTEGER,
      requiredCorrect INTEGER,
      durationMinutes INTEGER
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER,
      content TEXT,
      options TEXT,
      correctAnswerIndex INTEGER,
      isCritical BOOLEAN,
      number INTEGER,
      imageName TEXT,
      chapterId INTEGER,
      explain TEXT,
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
      id INTEGER,
      name TEXT UNIQUE,
      licenseId INTEGER,
      FOREIGN KEY (licenseId) REFERENCES licenses(id)
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      quizId INTEGER,
      questionId INTEGER,
      FOREIGN KEY (quizId) REFERENCES quizzes(id),
      FOREIGN KEY (questionId) REFERENCES questions(id),
      PRIMARY KEY (quizId, questionId)
    );

    CREATE TABLE IF NOT EXISTS quizesshistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quizId INTEGER,
      correctCount INTEGER,
      incorrectCount INTEGER,
      passed BOOLEAN,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quizId) REFERENCES quizzes(id)
    );

    CREATE TABLE IF NOT EXISTS save_question (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER NOT NULL,
      answer TEXT
    );

    CREATE TABLE IF NOT EXISTS history_question (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER NOT NULL,
      selectedOption INTEGER,
      FOREIGN KEY (questionId) REFERENCES questions(id)
    );
  `);
}

// Kiểm tra phiên bản
export async function checkVersion() {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ version: string }>(
    'SELECT version FROM version ORDER BY id DESC LIMIT 1'
  );
  const versionInDB = result?.version || null;
  try {
    const response = await API.get('versions/lastest');
    const newVersion = response.data.version;
    if (newVersion !== versionInDB) {
      await updateDataFromAPI();
    } 
  } catch (error) {
    console.error("❌ Lỗi khi lấy phiên bản từ API:", error);
  }
}

// get version lastest
export async function getVersion() {
  const db = await openDatabase();
  // Lấy phiên bản gần nhất
  const result = await db.getFirstAsync<{ id: number, version: string, createdAt: string, updatedAt: string }>(
    'SELECT * FROM version ORDER BY id DESC LIMIT 1'
  );
  return result;
}


//reset database drop all tables
export async function resetDatabase() {
  const db = await openDatabase();
  await db.execAsync(`
    DROP TABLE IF EXISTS history;
    DROP TABLE IF EXISTS chapters;
    DROP TABLE IF EXISTS licenses;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS question_licenses;
    DROP TABLE IF EXISTS quizzes;
    DROP TABLE IF EXISTS version;
    DROP TABLE IF EXISTS quizesshistory;
    DROP TABLE IF EXISTS quiz_questions;
    DROP TABLE IF EXISTS save_question;
    DROP TABLE IF EXISTS history_question;
  `);
  console.log('🗑️ Đã xóa tất cả dữ liệu!');
  await createTables();
  console.log('📦 Đã tạo lại bảng dữ liệu!');
  await updateDataFromAPI();
}

// Cập nhật dữ liệu
export async function updateDataFromAPI() {
  const db = await openDatabase();

  try {
    const [chaptersRes, licensesRes, questionsRes, quizzesRes, versionsRes] = await Promise.all([
      API.get('/chapters'),
      API.get('/licenses'),
      API.get('/questions'),
      API.get('/quizzes'),
      API.get('/versions'),
    ]);

    await db.withTransactionAsync(async () => {
      // Xóa dữ liệu cũ
      await db.runAsync('DELETE FROM chapters');
      await db.runAsync('DELETE FROM licenses');
      await db.runAsync('DELETE FROM questions');
      await db.runAsync('DELETE FROM quizzes');
      await db.runAsync('DELETE FROM question_licenses');
      await db.runAsync('DELETE FROM quiz_questions');
      await db.runAsync('DELETE FROM version');
      // await db.runAsync('DELETE FROM quizesshistory')

      // Thêm mới
      for (const chapter of chaptersRes.data) {
        await db.runAsync('INSERT INTO chapters (id, name) VALUES (?, ?)', chapter.id, chapter.name);
      }

      for (const license of licensesRes.data) {
        await db.runAsync(
          `INSERT INTO licenses (id, name, description, totalQuestions, requiredCorrect, durationMinutes)
           VALUES (?, ?, ?, ?, ?, ?)`,
          license.id,
          license.name,
          license.description,
          license.totalQuestions,
          license.requiredCorrect,
          license.durationMinutes
        );
      }
      

      for (const q of questionsRes.data) {
        await db.runAsync(
          `INSERT INTO questions (id, content, options, correctAnswerIndex, isCritical, number, imageName, chapterId, explain)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          q.id,
          q.content,
          JSON.stringify(q.options),
          q.correctAnswerIndex,
          q.isCritical,
          q.number,
          q.imageName,
          q.chapter.id,
          q.explain
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
          'INSERT INTO quizzes (id, name, licenseId) VALUES (?, ?, ?)',
          quiz.id,
          quiz.name,
          quiz.license.id
        );
        for (const question of quiz.questions) {
          await db.runAsync(
            'INSERT INTO quiz_questions (quizId, questionId) VALUES (?, ?)',
            quiz.id,
            question.id
          );
        }
      }

      for (const version of versionsRes.data) {
        await db.runAsync('INSERT INTO version (version) VALUES (?)', version.version);
      }

      console.log('🔄 Đã cập nhật dữ liệu từ API!');
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
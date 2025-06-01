import * as SQLite from 'expo-sqlite';
import API from './API';

let db: SQLite.SQLiteDatabase | null = null;

export async function openDatabase() {
  try {
    if (!db) {
      db = await SQLite.openDatabaseAsync('quiz.db');
    }
    return db;
  } catch (error) {
    console.error('Không thể mở database:', error);
    throw error;
  }
}

// Tạo bảng
export async function createTables() {
  const db = await openDatabase();

  // PRAGMA phải tách dòng rõ ràng
  await db.execAsync(`PRAGMA foreign_keys = OFF;`);
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  // Xoá tất cả bảng để tránh schema cũ gây lỗi
  await db.execAsync(`
    DROP TABLE IF EXISTS question_licenses;
    DROP TABLE IF EXISTS quiz_questions;
    DROP TABLE IF EXISTS quizzes;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS chapters;
    DROP TABLE IF EXISTS licenses;
    DROP TABLE IF EXISTS version;
    DROP TABLE IF EXISTS quizesshistory;
    DROP TABLE IF EXISTS save_question;
    DROP TABLE IF EXISTS history_question;
    DROP TABLE IF EXISTS frequentmistakes;
  `);

  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS chapters (
      id INTEGER PRIMARY KEY,
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
      id INTEGER PRIMARY KEY,
      content TEXT,
      options TEXT,
      correctAnswerIndex INTEGER,
      isCritical BOOLEAN,
      number INTEGER,
      imageName TEXT,
      chapterId INTEGER,
      explain TEXT,
      FOREIGN KEY (chapterId) REFERENCES chapters(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS question_licenses (
      questionId INTEGER,
      licenseId INTEGER,
      PRIMARY KEY (questionId, licenseId),
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE,
      FOREIGN KEY (licenseId) REFERENCES licenses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE,
      licenseId INTEGER,
      FOREIGN KEY (licenseId) REFERENCES licenses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      quizId INTEGER,
      questionId INTEGER,
      PRIMARY KEY (quizId, questionId),
      FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );

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

    CREATE TABLE IF NOT EXISTS quizesshistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quizId INTEGER,
      correctCount INTEGER,
      incorrectCount INTEGER,
      passed BOOLEAN,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS save_question (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER NOT NULL,
      answer TEXT,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS history_question (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER NOT NULL,
      selectedOption INTEGER,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS frequentmistakes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER NOT NULL,
      mistakeCount INTEGER DEFAULT 0,
      lastMistakeTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionId) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_question_chapter ON questions(chapterId);
    CREATE INDEX IF NOT EXISTS idx_question_license ON question_licenses(licenseId);
    CREATE INDEX IF NOT EXISTS idx_quiz_license ON quizzes(licenseId);
  `);

  console.log('✅ Tạo bảng thành công');
}

export async function checkVersion() {
  const db = await openDatabase();

  const result = await db.getFirstAsync<{ version: string }>(
    'SELECT version FROM version ORDER BY id DESC LIMIT 1'
  );
  const versionInDB = result?.version || null;

  try {
    const response = await API.get('versions/lastest');
    const newVersion = response.data.version;

    if (!versionInDB || newVersion !== versionInDB) {
      await updateDataFromAPI();
      await logHistory("hasSynced", "true");
    }
  } catch (error) {
    if (!versionInDB) {
      try {
        await updateDataFromAPI();
        await logHistory("hasSynced", "true");
      } catch (_) {
        // Không cần log lỗi fallback nếu muốn giữ clean
      }
    }
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

  // Tắt kiểm tra khóa ngoại để tránh lỗi khi xóa bảng có liên kết
  await db.execAsync(`PRAGMA foreign_keys = OFF;`);

  // Xoá toàn bộ bảng (đầy đủ tất cả bảng bạn đang dùng)
  await db.execAsync(`
    DROP TABLE IF EXISTS question_licenses;
    DROP TABLE IF EXISTS quiz_questions;
    DROP TABLE IF EXISTS quizzes;
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS chapters;
    DROP TABLE IF EXISTS licenses;
    DROP TABLE IF EXISTS version;
    DROP TABLE IF EXISTS quizesshistory;
    DROP TABLE IF EXISTS save_question;
    DROP TABLE IF EXISTS history_question;
    DROP TABLE IF EXISTS frequentmistakes;
  `);

  // Bật lại kiểm tra FOREIGN KEY
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  // Tạo lại bảng và cập nhật dữ liệu từ API
  await createTables();
  await updateDataFromAPI();
}


// Cập nhật dữ liệu
export async function updateDataFromAPI() {
  const db = await openDatabase();
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  try {
    const [chaptersRes, licensesRes, questionsRes, quizzesRes, versionsRes] = await Promise.all([
      API.get('/chapters'),
      API.get('/licenses'),
      API.get('/questions'),
      API.get('/quizzes'),
      API.get('/versions'),
    ]);

    await db.withTransactionAsync(async () => {
      try {
        // Ghi dữ liệu CHAPTERS
        for (const chapter of chaptersRes.data) {
          await db.runAsync(
            `INSERT OR REPLACE INTO chapters (id, name) VALUES (?, ?)`,
            chapter.id,
            chapter.name
          );
        }

        // Ghi dữ liệu LICENSES
        for (const license of licensesRes.data) {
          await db.runAsync(
            `INSERT OR REPLACE INTO licenses (id, name, description, totalQuestions, requiredCorrect, durationMinutes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            license.id,
            license.name,
            license.description,
            license.totalQuestions,
            license.requiredCorrect,
            license.durationMinutes
          );
        }

        // Ghi dữ liệu QUESTIONS + liên kết LICENSES
        for (const q of questionsRes.data) {
          await db.runAsync(
            `INSERT OR REPLACE INTO questions (id, content, options, correctAnswerIndex, isCritical, number, imageName, chapterId, explain)
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
          

          // Ghi bảng trung gian question_licenses
          for (const license of q.licenses) {
            await db.runAsync(
              `INSERT OR REPLACE INTO question_licenses (questionId, licenseId) VALUES (?, ?)`,
              q.id,
              license.id
            );
          }
        }

        // Ghi dữ liệu QUIZZES + liên kết QUESTIONS
        for (const quiz of quizzesRes.data) {
          await db.runAsync(
            `INSERT OR REPLACE INTO quizzes (id, name, licenseId) VALUES (?, ?, ?)`,
            quiz.id,
            quiz.name,
            quiz.license.id
          );

          for (const question of quiz.questions) {
            await db.runAsync(
              `INSERT OR REPLACE INTO quiz_questions (quizId, questionId) VALUES (?, ?)`,
              quiz.id,
              question.id
            );
          }
        }

        // Ghi dữ liệu VERSION
        for (const version of versionsRes.data) {
          await db.runAsync(
            `INSERT INTO version (version) VALUES (?)`,
            version.version
          );
        }

      } catch (transactionError) {
        console.error('❌ Lỗi trong transaction:', transactionError);
        throw transactionError;
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi cập nhật dữ liệu từ API:', error);
  }
}


// Ghi lịch sử
export async function logHistory(key: string, value: string) {
  const db = await openDatabase();
  await db.runAsync('INSERT INTO history (key, value) VALUES (?, ?)', key, value);
}
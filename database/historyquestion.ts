import { openDatabase } from './database';

export interface HistoryQuestion {
  id: number;
  questionId: number;
  selectedOption: number | null;
}

// Thêm một câu trả lời vào lịch sử
export async function insertHistoryQuestion(questionId: number, selectedOption: number): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(
    `INSERT INTO history_question (questionId, selectedOption) VALUES (?, ?);`,
    questionId,
    selectedOption
  );
}

// Cập nhật lựa chọn nếu câu hỏi đã có trong lịch sử
export async function updateHistoryQuestion(questionId: number, selectedOption: number): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(
    `UPDATE history_question SET selectedOption = ? WHERE questionId = ?;`,
    selectedOption,
    questionId
  );
}

// Xóa lịch sử theo ID
export async function deleteHistoryById(id: number): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(`DELETE FROM history_question WHERE id = ?;`, id);
}

// Xóa toàn bộ lịch sử
export async function clearAllHistory(): Promise<void> {
  const db = await openDatabase();
  await db.runAsync(`DELETE FROM history_question;`);
}

// Lấy lịch sử của một câu hỏi
export async function getHistoryByQuestionId(questionId: number): Promise<HistoryQuestion | null> {
  const db = await openDatabase();
  return db.getFirstAsync<HistoryQuestion>(
    `SELECT * FROM history_question WHERE questionId = ?`,
    questionId
  );
}

// Lấy toàn bộ lịch sử câu trả lời
export async function getAllHistoryQuestions(): Promise<HistoryQuestion[]> {
  const db = await openDatabase();
  return db.getAllAsync<HistoryQuestion>(`SELECT * FROM history_question;`);
}

//total records
export async function getSavedQuestionCount(): Promise<number> {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM history_question;`);
  return result?.count ?? 0;
}
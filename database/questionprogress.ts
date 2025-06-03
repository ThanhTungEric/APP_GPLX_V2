import { openDatabase } from './database';

/**
 * Lưu lại câu hỏi đã làm đúng — mỗi câu chỉ lưu một lần.
 * @param questionId ID của câu hỏi
 */
export async function saveCorrectQuestion(questionId: number): Promise<void> {
  const db = await openDatabase();

  await db.runAsync(
    'INSERT OR IGNORE INTO question_progress (questionId) VALUES (?)',
    questionId
  );
}

/**
 * Trả về tổng số câu hỏi đã làm đúng (đã được lưu).
 * @returns Số lượng câu hỏi đã lưu trong bảng question_progress
 */
export async function getCorrectQuestionCount(): Promise<number> {
  const db = await openDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM question_progress'
  );
  return result?.count ?? 0;
}

import { query, transaction } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

export async function listQuizzes(req, res) {
  const rows = await query('SELECT id, title, description, status, created_at FROM quizzes ORDER BY created_at DESC');
  ok(res, { quizzes: rows });
}

export async function getActiveQuiz(req, res) {
  const quizzes = await query("SELECT * FROM quizzes WHERE status = 'active' ORDER BY created_at DESC LIMIT 1");
  if (!quizzes.length) throw new HttpError(404, 'No active quiz found');
  const quiz = quizzes[0];
  const questions = await query('SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY display_order ASC', [quiz.id]);
  const options = await query(
    `SELECT o.* FROM quiz_options o
     JOIN quiz_questions q ON q.id = o.question_id
     WHERE q.quiz_id = ? ORDER BY o.display_order ASC`,
    [quiz.id]
  );
  ok(res, {
    quiz,
    questions: questions.map((question) => ({
      ...question,
      options: options.filter((option) => option.question_id === question.id)
    }))
  });
}

export async function submitQuiz(req, res) {
  const quizId = Number(req.params.quizId);
  const { answers } = req.body;
  const quizzes = await query('SELECT id FROM quizzes WHERE id = ? AND status = ?', [quizId, 'active']);
  if (!quizzes.length) throw new HttpError(404, 'Quiz not found');

  const result = await transaction(async (conn) => {
    const [submission] = await conn.execute(
      `INSERT INTO quiz_submissions (quiz_id, user_id, readiness_score, status)
       VALUES (?, ?, 0, 'submitted')`,
      [quizId, req.user.id]
    );

    let score = 0;
    for (const answer of answers) {
      const [[option]] = await conn.execute('SELECT readiness_points FROM quiz_options WHERE id = ? AND question_id = ?', [answer.optionId, answer.questionId]);
      score += option?.readiness_points || 0;
      await conn.execute(
        `INSERT INTO quiz_answers (submission_id, question_id, option_id, answer_text)
         VALUES (?, ?, ?, ?)`,
        [submission.insertId, answer.questionId, answer.optionId || null, answer.answerText || null]
      );
    }
    await conn.execute('UPDATE quiz_submissions SET readiness_score = ? WHERE id = ?', [score, submission.insertId]);
    return { submissionId: submission.insertId, score };
  });

  created(res, result, 'Quiz submitted');
}

export async function listSubmissions(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const params = [];
  let where = '';
  if (req.user.role !== 'admin') {
    where = `WHERE u.hbt_id = ? OR u.partnership_id IN (SELECT id FROM partnerships WHERE hbt_id = ?)`;
    params.push(req.user.hbt_id, req.user.hbt_id);
  }
  const rows = await query(
    `SELECT s.*, q.title AS quiz_title, u.first_name, u.last_name, u.email
     FROM quiz_submissions s
     JOIN quizzes q ON q.id = s.quiz_id
     JOIN users u ON u.id = s.user_id
     ${where}
     ORDER BY s.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  ok(res, { page, limit, submissions: rows });
}

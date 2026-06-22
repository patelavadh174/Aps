import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

async function employeeHbtId(user) {
  if (user.hbt_id) return user.hbt_id;
  if (!user.partnership_id) return null;
  const rows = await query('SELECT hbt_id FROM partnerships WHERE id = ? LIMIT 1', [user.partnership_id]);
  return rows[0]?.hbt_id || null;
}

export async function getMyThread(req, res) {
  const hbtId = await employeeHbtId(req.user);
  let rows = await query(
    `SELECT * FROM message_threads WHERE employee_id = ? ORDER BY updated_at DESC LIMIT 1`,
    [req.user.id]
  );
  if (!rows.length) {
    const result = await query(
      `INSERT INTO message_threads (employee_id, hbt_id, subject, status)
       VALUES (?, ?, ?, 'open')`,
      [req.user.id, hbtId, 'HomeBoost Support']
    );
    rows = await query('SELECT * FROM message_threads WHERE id = ?', [result.insertId]);
  }
  const messages = await query(
    `SELECT m.*, u.first_name, u.last_name, u.role
     FROM messages m JOIN users u ON u.id = m.sender_id
     WHERE m.thread_id = ? ORDER BY m.created_at ASC`,
    [rows[0].id]
  );
  ok(res, { thread: rows[0], messages });
}

export async function createMyThreadMessage(req, res) {
  const { body } = req.body;
  const hbtId = await employeeHbtId(req.user);
  let threads = await query('SELECT id FROM message_threads WHERE employee_id = ? ORDER BY updated_at DESC LIMIT 1', [req.user.id]);
  if (!threads.length) {
    const result = await query(
      `INSERT INTO message_threads (employee_id, hbt_id, subject, status) VALUES (?, ?, ?, 'open')`,
      [req.user.id, hbtId, 'HomeBoost Support']
    );
    threads = [{ id: result.insertId }];
  }
  await query('INSERT INTO messages (thread_id, sender_id, body) VALUES (?, ?, ?)', [threads[0].id, req.user.id, body]);
  await query('UPDATE message_threads SET updated_at = NOW(), status = ? WHERE id = ?', ['open', threads[0].id]);
  created(res, null, 'Message sent');
}

export async function listThreads(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const params = [];
  let where = '';
  if (req.user.role !== 'admin') {
    where = 'WHERE t.hbt_id = ?';
    params.push(req.user.hbt_id);
  }
  const rows = await query(
    `SELECT t.*, u.first_name, u.last_name, u.email,
            (SELECT body FROM messages WHERE thread_id = t.id ORDER BY created_at DESC LIMIT 1) AS last_message
     FROM message_threads t
     JOIN users u ON u.id = t.employee_id
     ${where}
     ORDER BY t.updated_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  ok(res, { page, limit, threads: rows });
}

export async function getThread(req, res) {
  const id = Number(req.params.threadId);
  const rows = await query('SELECT * FROM message_threads WHERE id = ?', [id]);
  const thread = rows[0];
  if (!thread) throw new HttpError(404, 'Thread not found');
  if (req.user.role !== 'admin' && req.user.role !== 'employee' && thread.hbt_id !== req.user.hbt_id) {
    throw new HttpError(403, 'Not your thread');
  }
  if (req.user.role === 'employee' && thread.employee_id !== req.user.id) throw new HttpError(403, 'Not your thread');
  const messages = await query(
    `SELECT m.*, u.first_name, u.last_name, u.role
     FROM messages m JOIN users u ON u.id = m.sender_id
     WHERE m.thread_id = ? ORDER BY m.created_at ASC`,
    [id]
  );
  ok(res, { thread, messages });
}

export async function replyToThread(req, res) {
  const id = Number(req.params.threadId);
  const thread = (await query('SELECT * FROM message_threads WHERE id = ?', [id]))[0];
  if (!thread) throw new HttpError(404, 'Thread not found');
  if (req.user.role !== 'admin' && thread.hbt_id !== req.user.hbt_id) throw new HttpError(403, 'Not your thread');
  await query('INSERT INTO messages (thread_id, sender_id, body) VALUES (?, ?, ?)', [id, req.user.id, req.body.body]);
  await query('UPDATE message_threads SET updated_at = NOW(), status = ? WHERE id = ?', [req.body.status || 'open', id]);
  created(res, null, 'Reply sent');
}

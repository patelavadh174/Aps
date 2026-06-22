import { query } from '../config/db.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

export async function createContact(req, res) {
  const { name, email, company, message } = req.body;
  const result = await query(
    `INSERT INTO contact_messages (name, email, company, message, status)
     VALUES (?, ?, ?, ?, 'new')`,
    [name, email.toLowerCase(), company || null, message]
  );
  created(res, { id: result.insertId }, 'Message received');
}

export async function listContactMessages(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const rows = await query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
  ok(res, { page, limit, messages: rows });
}

export async function updateContactMessage(req, res) {
  await query('UPDATE contact_messages SET status = ? WHERE id = ?', [req.body.status, Number(req.params.id)]);
  ok(res, null, 'Contact message updated');
}

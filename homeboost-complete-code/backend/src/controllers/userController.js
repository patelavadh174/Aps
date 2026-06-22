import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

const SAFE_FIELDS = `u.id, u.first_name, u.last_name, u.email, u.role, u.status, u.partnership_id, u.hbt_id, u.last_login_at, u.created_at`;

export async function listUsers(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const filters = [];
  const params = [];

  if (req.query.role) {
    filters.push('u.role = ?');
    params.push(req.query.role);
  }

  if (req.user.role !== 'admin') {
    filters.push('(u.hbt_id = ? OR u.partnership_id IN (SELECT id FROM partnerships WHERE hbt_id = ?))');
    params.push(req.user.hbt_id, req.user.hbt_id);
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const rows = await query(
    `SELECT ${SAFE_FIELDS}, p.name AS partnership_name, e.name AS employer_name
     FROM users u
     LEFT JOIN partnerships p ON p.id = u.partnership_id
     LEFT JOIN employers e ON e.id = p.employer_id
     ${where}
     ORDER BY u.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  ok(res, { page, limit, users: rows });
}

export async function createUser(req, res) {
  const { firstName, lastName, email, password, role, partnershipId, hbtId } = req.body;
  const exists = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
  if (exists.length) throw new HttpError(409, 'Email already exists');

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, partnership_id, hbt_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'active')`,
    [firstName, lastName, email.toLowerCase(), passwordHash, role, partnershipId || null, hbtId || null]
  );
  const rows = await query(`SELECT ${SAFE_FIELDS} FROM users u WHERE id = ?`, [result.insertId]);
  created(res, { user: rows[0] }, 'User created');
}

export async function updateUser(req, res) {
  const id = Number(req.params.id);
  const { role, status, partnershipId, hbtId } = req.body;
  const rows = await query('SELECT id FROM users WHERE id = ?', [id]);
  if (!rows.length) throw new HttpError(404, 'User not found');

  await query(
    `UPDATE users
     SET role = COALESCE(?, role), status = COALESCE(?, status), partnership_id = ?, hbt_id = ?
     WHERE id = ?`,
    [role || null, status || null, partnershipId ?? null, hbtId ?? null, id]
  );
  const updated = await query(`SELECT ${SAFE_FIELDS} FROM users u WHERE id = ?`, [id]);
  ok(res, { user: updated[0] }, 'User updated');
}

export async function deleteUser(req, res) {
  const id = Number(req.params.id);
  await query('UPDATE users SET status = ? WHERE id = ?', ['disabled', id]);
  ok(res, null, 'User disabled');
}

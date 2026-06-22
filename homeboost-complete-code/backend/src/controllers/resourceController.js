import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

function visibilityClause(user) {
  if (!user) return ['status = ? AND visibility IN (?, ?)', ['published', 'public', 'employee']];
  if (user.role === 'admin') return ['1=1', []];
  if (['hbt_admin', 'hbt_member'].includes(user.role)) {
    return ['status = ? AND (visibility IN (?, ?, ?) OR hbt_id = ?)', ['published', 'public', 'employee', 'hbt', user.hbt_id]];
  }
  return ['status = ? AND visibility IN (?, ?)', ['published', 'public', 'employee']];
}

export async function listResources(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const [clause, params] = visibilityClause(req.user);
  const rows = await query(
    `SELECT id, title, slug, category, summary, body, visibility, status, hbt_id, created_at
     FROM resources
     WHERE ${clause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  ok(res, { page, limit, resources: rows });
}

export async function getResource(req, res) {
  const rows = await query('SELECT * FROM resources WHERE id = ? OR slug = ? LIMIT 1', [req.params.idOrSlug, req.params.idOrSlug]);
  if (!rows.length) throw new HttpError(404, 'Resource not found');
  ok(res, { resource: rows[0] });
}

export async function createResource(req, res) {
  const { title, slug, category, summary, body, visibility, status, hbtId } = req.body;
  const result = await query(
    `INSERT INTO resources (title, slug, category, summary, body, visibility, status, hbt_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, category || 'General', summary || '', body, visibility || 'employee', status || 'draft', hbtId || null, req.user.id]
  );
  const rows = await query('SELECT * FROM resources WHERE id = ?', [result.insertId]);
  created(res, { resource: rows[0] }, 'Resource created');
}

export async function updateResource(req, res) {
  const id = Number(req.params.id);
  const current = await query('SELECT id FROM resources WHERE id = ?', [id]);
  if (!current.length) throw new HttpError(404, 'Resource not found');
  const { title, category, summary, body, visibility, status } = req.body;
  await query(
    `UPDATE resources
     SET title = COALESCE(?, title), category = COALESCE(?, category), summary = COALESCE(?, summary),
         body = COALESCE(?, body), visibility = COALESCE(?, visibility), status = COALESCE(?, status)
     WHERE id = ?`,
    [title || null, category || null, summary || null, body || null, visibility || null, status || null, id]
  );
  const rows = await query('SELECT * FROM resources WHERE id = ?', [id]);
  ok(res, { resource: rows[0] }, 'Resource updated');
}

export async function deleteResource(req, res) {
  await query('UPDATE resources SET status = ? WHERE id = ?', ['archived', Number(req.params.id)]);
  ok(res, null, 'Resource archived');
}

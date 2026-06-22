import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

export async function listPartnerships(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const params = [];
  let where = '';
  if (req.user.role !== 'admin') {
    where = 'WHERE p.hbt_id = ?';
    params.push(req.user.hbt_id);
  }
  const rows = await query(
    `SELECT p.*, e.name AS employer_name, h.name AS hbt_name,
            (SELECT COUNT(*) FROM users u WHERE u.partnership_id = p.id AND u.status = 'active') AS employee_count
     FROM partnerships p
     JOIN employers e ON e.id = p.employer_id
     LEFT JOIN home_buying_teams h ON h.id = p.hbt_id
     ${where}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  ok(res, { page, limit, partnerships: rows });
}

export async function createPartnership(req, res) {
  const { employerName, slug, hbtId, heroHeadline, heroSubheadline } = req.body;
  const existing = await query('SELECT id FROM partnerships WHERE slug = ? LIMIT 1', [slug]);
  if (existing.length) throw new HttpError(409, 'Slug already exists');

  let employer = await query('SELECT id FROM employers WHERE name = ? LIMIT 1', [employerName]);
  let employerId = employer[0]?.id;
  if (!employerId) {
    const result = await query('INSERT INTO employers (name, status) VALUES (?, ?)', [employerName, 'active']);
    employerId = result.insertId;
  }

  const result = await query(
    `INSERT INTO partnerships (employer_id, hbt_id, name, slug, hero_headline, hero_subheadline, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [employerId, hbtId || req.user.hbt_id || null, `${employerName} HomeBoost Program`, slug, heroHeadline, heroSubheadline]
  );
  const rows = await query('SELECT * FROM partnerships WHERE id = ?', [result.insertId]);
  created(res, { partnership: rows[0] }, 'Partnership created');
}

export async function updatePartnership(req, res) {
  const id = Number(req.params.id);
  const current = await query('SELECT * FROM partnerships WHERE id = ?', [id]);
  if (!current.length) throw new HttpError(404, 'Partnership not found');
  if (req.user.role !== 'admin' && current[0].hbt_id !== req.user.hbt_id) throw new HttpError(403, 'Not your partnership');

  const { name, status, heroHeadline, heroSubheadline } = req.body;
  await query(
    `UPDATE partnerships
     SET name = COALESCE(?, name), status = COALESCE(?, status),
         hero_headline = COALESCE(?, hero_headline), hero_subheadline = COALESCE(?, hero_subheadline)
     WHERE id = ?`,
    [name || null, status || null, heroHeadline || null, heroSubheadline || null, id]
  );
  const rows = await query('SELECT * FROM partnerships WHERE id = ?', [id]);
  ok(res, { partnership: rows[0] }, 'Partnership updated');
}

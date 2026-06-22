import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';
import { pagination } from '../utils/pagination.js';

export async function listEvents(req, res) {
  const { limit, offset, page } = pagination(req.query);
  const rows = await query(
    `SELECT ev.*, p.name AS partnership_name
     FROM events ev
     LEFT JOIN partnerships p ON p.id = ev.partnership_id
     WHERE ev.status <> 'archived'
     ORDER BY ev.starts_at ASC
     LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  ok(res, { page, limit, events: rows });
}

export async function createEvent(req, res) {
  const { title, description, eventType, startsAt, endsAt, location, partnershipId, status } = req.body;
  const result = await query(
    `INSERT INTO events (title, description, event_type, starts_at, ends_at, location, partnership_id, hbt_id, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description || '', eventType || 'workshop', startsAt, endsAt || null, location || 'Online', partnershipId || null, req.user.hbt_id || null, status || 'published', req.user.id]
  );
  const rows = await query('SELECT * FROM events WHERE id = ?', [result.insertId]);
  created(res, { event: rows[0] }, 'Event created');
}

export async function updateEvent(req, res) {
  const id = Number(req.params.id);
  const current = await query('SELECT * FROM events WHERE id = ?', [id]);
  if (!current.length) throw new HttpError(404, 'Event not found');
  const { title, description, startsAt, endsAt, location, status } = req.body;
  await query(
    `UPDATE events SET title = COALESCE(?, title), description = COALESCE(?, description),
     starts_at = COALESCE(?, starts_at), ends_at = COALESCE(?, ends_at), location = COALESCE(?, location), status = COALESCE(?, status)
     WHERE id = ?`,
    [title || null, description || null, startsAt || null, endsAt || null, location || null, status || null, id]
  );
  const rows = await query('SELECT * FROM events WHERE id = ?', [id]);
  ok(res, { event: rows[0] }, 'Event updated');
}

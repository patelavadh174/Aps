import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { ok } from '../utils/respond.js';

export async function getPublicPartnership(req, res) {
  const rows = await query(
    `SELECT p.id, p.name, p.slug, p.hero_headline, p.hero_subheadline, p.primary_cta_label,
            e.name AS employer_name, e.logo_url, e.industry,
            h.name AS hbt_name, h.support_email, h.support_phone
     FROM partnerships p
     JOIN employers e ON e.id = p.employer_id
     LEFT JOIN home_buying_teams h ON h.id = p.hbt_id
     WHERE p.slug = ? AND p.status = 'active'
     LIMIT 1`,
    [req.params.slug]
  );
  if (!rows.length) throw new HttpError(404, 'Employer portal not found');

  const partnership = rows[0];
  const resources = await query(
    `SELECT id, title, slug, category, summary
     FROM resources
     WHERE status = 'published' AND visibility IN ('public','employee')
     ORDER BY created_at DESC
     LIMIT 6`
  );
  const events = await query(
    `SELECT id, title, event_type, starts_at, location
     FROM events
     WHERE status = 'published' AND partnership_id = ? AND starts_at >= NOW()
     ORDER BY starts_at ASC
     LIMIT 5`,
    [partnership.id]
  );

  ok(res, { partnership, resources, events });
}

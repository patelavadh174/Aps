import { query } from '../config/db.js';
import { ok } from '../utils/respond.js';

export async function dashboard(req, res) {
  const userId = req.user.id;
  const partnershipId = req.user.partnership_id;
  const [resourceCount] = await query("SELECT COUNT(*) AS count FROM resources WHERE status = 'published' AND visibility IN ('public','employee')");
  const [eventCount] = await query(
    "SELECT COUNT(*) AS count FROM events WHERE status = 'published' AND starts_at >= NOW() AND (partnership_id = ? OR partnership_id IS NULL)",
    [partnershipId]
  );
  const [quizCount] = await query("SELECT COUNT(*) AS count FROM quizzes WHERE status = 'active'");
  const [messageCount] = await query(
    `SELECT COUNT(*) AS count
     FROM messages m
     JOIN message_threads t ON t.id = m.thread_id
     WHERE t.employee_id = ? AND m.sender_id <> ? AND m.read_at IS NULL`,
    [userId, userId]
  );
  const resources = await query(
    `SELECT id, title, slug, category, summary FROM resources
     WHERE status = 'published' AND visibility IN ('public','employee')
     ORDER BY created_at DESC LIMIT 4`
  );
  const events = await query(
    `SELECT id, title, event_type, starts_at, location FROM events
     WHERE status = 'published' AND starts_at >= NOW() AND (partnership_id = ? OR partnership_id IS NULL)
     ORDER BY starts_at ASC LIMIT 4`,
    [partnershipId]
  );

  ok(res, {
    stats: {
      resources: resourceCount.count,
      upcomingEvents: eventCount.count,
      activeQuizzes: quizCount.count,
      unreadMessages: messageCount.count
    },
    resources,
    events
  });
}

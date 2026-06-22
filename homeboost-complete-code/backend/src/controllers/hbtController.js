import { query } from '../config/db.js';
import { created, ok } from '../utils/respond.js';

export async function listHbts(req, res) {
  const rows = await query(
    `SELECT h.*, (SELECT COUNT(*) FROM partnerships p WHERE p.hbt_id = h.id) AS partnership_count
     FROM home_buying_teams h ORDER BY h.created_at DESC`
  );
  ok(res, { hbts: rows });
}

export async function createHbt(req, res) {
  const { name, supportEmail, supportPhone } = req.body;
  const result = await query(
    `INSERT INTO home_buying_teams (name, support_email, support_phone, status)
     VALUES (?, ?, ?, 'active')`,
    [name, supportEmail, supportPhone || null]
  );
  const rows = await query('SELECT * FROM home_buying_teams WHERE id = ?', [result.insertId]);
  created(res, { hbt: rows[0] }, 'Home Buying Team created');
}

export async function listTeamMembers(req, res) {
  const hbtId = req.params.hbtId || req.user.hbt_id;
  const rows = await query(
    `SELECT tm.*, u.first_name, u.last_name, u.email, u.role
     FROM team_members tm JOIN users u ON u.id = tm.user_id
     WHERE tm.hbt_id = ? ORDER BY u.last_name ASC`,
    [hbtId]
  );
  ok(res, { members: rows });
}

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';

function publicUser(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    partnershipId: user.partnership_id,
    hbtId: user.hbt_id
  };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export async function signup(req, res) {
  const { firstName, lastName, email, password, partnershipSlug } = req.body;
  const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
  if (existing.length) throw new HttpError(409, 'An account with this email already exists');

  let partnershipId = null;
  if (partnershipSlug) {
    const partnerships = await query('SELECT id FROM partnerships WHERE slug = ? AND status = ? LIMIT 1', [partnershipSlug, 'active']);
    if (!partnerships.length) throw new HttpError(404, 'Employer portal was not found');
    partnershipId = partnerships[0].id;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role, partnership_id, status)
     VALUES (?, ?, ?, ?, 'employee', ?, 'active')`,
    [firstName, lastName, email.toLowerCase(), passwordHash, partnershipId]
  );

  const users = await query('SELECT * FROM users WHERE id = ?', [result.insertId]);
  const user = users[0];
  created(res, { user: publicUser(user), token: signToken(user) }, 'Account created');
}

export async function login(req, res) {
  const { email, password } = req.body;
  const users = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
  const user = users[0];
  if (!user) throw new HttpError(401, 'Invalid email or password');
  if (user.status !== 'active') throw new HttpError(403, 'Account is not active');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new HttpError(401, 'Invalid email or password');

  await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
  ok(res, { user: publicUser(user), token: signToken(user) }, 'Logged in');
}

export async function me(req, res) {
  ok(res, { user: publicUser({
    id: req.user.id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    role: req.user.role,
    partnership_id: req.user.partnership_id,
    hbt_id: req.user.hbt_id
  }) });
}

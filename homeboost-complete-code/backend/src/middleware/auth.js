import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { query } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) throw new HttpError(401, 'Authentication required');

    const decoded = jwt.verify(token, env.jwtSecret);
    const users = await query(
      `SELECT id, first_name, last_name, email, role, status, partnership_id, hbt_id
       FROM users WHERE id = ? LIMIT 1`,
      [decoded.sub]
    );
    const user = users[0];
    if (!user || user.status !== 'active') throw new HttpError(401, 'Account is not active');

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError(401, 'Invalid or expired token'));
  }
}

export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) throw new HttpError(401, 'Authentication required');
    if (!roles.includes(req.user.role)) {
      throw new HttpError(403, 'You do not have permission to perform this action');
    }
    next();
  };
}

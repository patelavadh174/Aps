import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { query, transaction } from '../config/db.js';
import { HttpError } from '../utils/httpError.js';
import { created, ok } from '../utils/respond.js';

const storage = multer.memoryStorage();
export const uploadCsv = multer({
  storage,
  limits: { fileSize: 1024 * 1024 },
  fileFilter(req, file, cb) {
    const okFile = file.originalname.toLowerCase().endsWith('.csv') || file.mimetype.includes('csv') || file.mimetype === 'text/plain';
    cb(okFile ? null : new Error('Only CSV files are allowed'), okFile);
  }
});

export async function listBatches(req, res) {
  const rows = await query(
    `SELECT b.*, p.name AS partnership_name FROM enrollment_batches b
     JOIN partnerships p ON p.id = b.partnership_id
     ORDER BY b.created_at DESC LIMIT 50`
  );
  ok(res, { batches: rows });
}

export async function enrollCsv(req, res) {
  const partnershipId = Number(req.body.partnershipId);
  if (!req.file) throw new HttpError(400, 'CSV file is required');
  const partnershipRows = await query('SELECT * FROM partnerships WHERE id = ?', [partnershipId]);
  const partnership = partnershipRows[0];
  if (!partnership) throw new HttpError(404, 'Partnership not found');
  if (req.user.role !== 'admin' && partnership.hbt_id !== req.user.hbt_id) throw new HttpError(403, 'Not your partnership');

  const records = parse(req.file.buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  const batchCode = randomUUID();
  const tempPasswordHash = await bcrypt.hash('Password123!', 12);
  const result = await transaction(async (conn) => {
    const [batch] = await conn.execute(
      `INSERT INTO enrollment_batches (partnership_id, uploaded_by, original_filename, batch_code, total_rows, imported_rows, skipped_rows, status)
       VALUES (?, ?, ?, ?, ?, 0, 0, 'active')`,
      [partnershipId, req.user.id, req.file.originalname, batchCode, records.length]
    );

    let imported = 0;
    let skipped = 0;
    const errors = [];

    for (const [index, record] of records.entries()) {
      const email = String(record.email || record.Email || '').toLowerCase().trim();
      const firstName = String(record.first_name || record.firstName || record['First Name'] || '').trim();
      const lastName = String(record.last_name || record.lastName || record['Last Name'] || '').trim();
      if (!email || !firstName || !lastName) {
        skipped += 1;
        errors.push({ row: index + 2, reason: 'Missing first_name, last_name, or email' });
        continue;
      }
      const [[existing]] = await conn.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
      if (existing) {
        skipped += 1;
        errors.push({ row: index + 2, email, reason: 'Duplicate email skipped' });
        continue;
      }
      await conn.execute(
        `INSERT INTO users (first_name, last_name, email, password_hash, role, partnership_id, hbt_id, enrollment_batch_id, status)
         VALUES (?, ?, ?, ?, 'employee', ?, ?, ?, 'active')`,
        [firstName, lastName, email, tempPasswordHash, partnershipId, partnership.hbt_id, batch.insertId]
      );
      imported += 1;
    }

    await conn.execute('UPDATE enrollment_batches SET imported_rows = ?, skipped_rows = ? WHERE id = ?', [imported, skipped, batch.insertId]);
    return { batchId: batch.insertId, imported, skipped, errors };
  });

  created(res, result, 'CSV processed');
}

export async function revokeBatch(req, res) {
  const id = Number(req.params.id);
  const batch = (await query('SELECT * FROM enrollment_batches WHERE id = ?', [id]))[0];
  if (!batch) throw new HttpError(404, 'Batch not found');
  await transaction(async (conn) => {
    await conn.execute('UPDATE users SET status = ? WHERE enrollment_batch_id = ? AND role = ?', ['disabled', id, 'employee']);
    await conn.execute('UPDATE enrollment_batches SET status = ?, revoked_at = NOW() WHERE id = ?', ['revoked', id]);
  });
  ok(res, null, 'Batch revoked');
}

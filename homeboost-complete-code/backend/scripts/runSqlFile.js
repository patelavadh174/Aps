import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/runSqlFile.js database/schema.sql');
  process.exit(1);
}

const sqlPath = path.resolve(file);
const sql = fs.readFileSync(sqlPath, 'utf8');
const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

await connection.query(sql);
await connection.end();
console.log(`Executed ${file}`);

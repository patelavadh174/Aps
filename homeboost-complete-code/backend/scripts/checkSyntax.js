import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const root = path.resolve('src');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.js')) files.push(full);
  }
}
walk(root);

let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  if (result.status !== 0) {
    failed = true;
    console.error(result.stderr.toString());
  }
}
if (failed) process.exit(1);
console.log(`Syntax check passed for ${files.length} files.`);

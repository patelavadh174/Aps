import request from 'supertest';
import { app } from '../src/app.js';

const response = await request(app).get('/api/health');
if (response.status !== 200 || response.body?.data?.status !== 'healthy') {
  console.error('Health smoke test failed', response.status, response.body);
  process.exit(1);
}
console.log('Smoke test passed.');

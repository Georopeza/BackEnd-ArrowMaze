import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';

describe('GET /health', () => {
  it('responde 200 con status ok', async () => {
    const app = await createServer();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

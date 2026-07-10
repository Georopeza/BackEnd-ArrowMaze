import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';

describe('GET /health', () => {
  it('should_respond_200_with_ok_status', async () => {
    const app = await createServer();

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});

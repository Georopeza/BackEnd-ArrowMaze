import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';

describe('Unmatched routes', () => {
  it('should_respond_404_with_consistent_error_shape_for_unknown_route', async () => {
    const app = await createServer();

    const response = await request(app).get('/this-route-does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { message: 'Route not found: GET /this-route-does-not-exist' },
    });
  });
});

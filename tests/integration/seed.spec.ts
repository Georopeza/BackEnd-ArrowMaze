import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';
import { LEVEL_SEED_CATALOG } from '../../src/infrastructure/persistence/seed/levelSeedCatalog';

describe('Level catalog seed', () => {
  it('should_expose_seeded_levels_on_GET_levels_when_seedLevels_is_enabled', async () => {
    const app = await createServer('test-secret', { seedLevels: true });

    const response = await request(app).get('/levels');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(LEVEL_SEED_CATALOG.length);
    expect(response.body.map((l: { id: string }) => l.id)).toContain('simple-1');
  });

  it('should_start_empty_when_seedLevels_is_disabled', async () => {
    const app = await createServer('test-secret', { seedLevels: false });

    const response = await request(app).get('/levels');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});

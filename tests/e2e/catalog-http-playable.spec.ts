import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';
import {
  LEVEL_SEED_CATALOG,
  LEVEL_SEED_CATALOG_SIZE,
} from '../../src/infrastructure/persistence/seed/levelSeedCatalog';

/**
 * E2E HTTP: el catálogo sembrado es consultable y cumple el contrato mínimo
 * que consume el frontend (`StructuredLevelJsonDto`).
 */
describe('E2E — HTTP catalog playable', () => {
  it('should_return_seeded_levels_with_required_wire_fields', async () => {
    const app = await createServer('test-secret', { seedLevels: true });

    const response = await request(app).get('/levels');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(LEVEL_SEED_CATALOG_SIZE);

    for (const level of response.body) {
      expect(level).toMatchObject({
        id: expect.any(String),
        levelNumber: expect.any(Number),
        difficulty: expect.stringMatching(/^(EASY|MEDIUM|HARD|EXPERT)$/),
        maxMoves: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number),
        exit: { row: expect.any(Number), col: expect.any(Number) },
        arrows: expect.any(Array),
      });
      expect(level.arrows.length).toBeGreaterThan(0);
    }
  });

  it('should_fetch_each_catalog_entry_by_id', async () => {
    const app = await createServer('test-secret', { seedLevels: true });

    for (const expected of LEVEL_SEED_CATALOG) {
      const response = await request(app).get(`/levels/${expected.id}`);
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(expected.id);
      expect(response.body.levelNumber).toBe(expected.levelNumber);
    }
  });
});

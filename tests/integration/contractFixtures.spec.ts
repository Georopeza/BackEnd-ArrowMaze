import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { z, ZodError } from 'zod';
import { createServer } from '../../src/infrastructure/http/server';
import { bearerHeader, obtainAuthToken } from '../support/authTestHelper';

/**
 * Pruebas de contrato: verifican que las respuestas/peticiones REALES de la
 * API (no una re-implementación de su forma) coinciden con los fixtures
 * compartidos bit-a-bit con `Arrow-Maze-Escape-Puzzle/docs/contract/fixtures/`
 * (ver `docs/contract/fixtures/README.md` para la justificación de este
 * enfoque en vez de Pact).
 *
 * Se compara el conjunto de claves de nivel superior de cada respuesta real
 * contra el fixture correspondiente: una prueba de contrato verifica forma,
 * no valores exactos (los valores dependen de datos generados en cada test).
 */

const fixturesDir = path.join(__dirname, '../../docs/contract/fixtures');

function loadFixture<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), 'utf-8'));
}

function expectSameKeys(actual: object, expected: object): void {
  expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
}

/** Esquema Zod idéntico al de `progress.routes.ts`, para validar el fixture de request. */
const syncProgressSchema = z.object({
  userId: z.string().min(1),
  levelId: z.string().min(1),
  score: z.number().int().nonnegative(),
  moves: z.number().int().nonnegative(),
  timeInSeconds: z.number().int().nonnegative(),
  completed: z.boolean(),
});

const solvableLevelDto = {
  levelNumber: 1,
  difficulty: 'EASY',
  maxMoves: 5,
  maxTimeInSeconds: 60,
  width: 3,
  height: 1,
  exit: { row: 0, col: 2 },
  arrows: [{ id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 1 }] }],
};

describe('Contract fixtures — auth, progress, leaderboard', () => {
  it('should_accept_the_shared_progress_sync_request_fixture', () => {
    const fixture = loadFixture('progress-sync-request.json');

    expect(() => syncProgressSchema.parse(fixture)).not.toThrow();
  });

  it('should_reject_a_progress_sync_request_missing_a_field_from_the_fixture', () => {
    const fixture = loadFixture<Record<string, unknown>>('progress-sync-request.json');
    const { completed: _completed, ...withoutCompleted } = fixture;

    expect(() => syncProgressSchema.parse(withoutCompleted)).toThrow(ZodError);
  });

  it('should_return_a_register_response_matching_the_shared_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture<Record<string, unknown>>('auth-register-response.json');

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'contract_register', password: 'super-secret' });

    expect(response.status).toBe(201);
    expectSameKeys(response.body, fixture);
  });

  it('should_return_a_login_response_matching_the_shared_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture<Record<string, unknown>>('auth-login-response.json');
    await request(app).post('/auth/register').send({ username: 'contract_login', password: 'super-secret' });

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'contract_login', password: 'super-secret' });

    expect(response.status).toBe(200);
    expectSameKeys(response.body, fixture);
  });

  it('should_return_a_progress_sync_response_matching_the_shared_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture<Record<string, unknown>>('progress-sync-response.json');
    await request(app).post('/auth/register').send({ username: 'contract_sync', password: 'super-secret' });
    const login = await request(app).post('/auth/login').send({ username: 'contract_sync', password: 'super-secret' });
    const token = login.body.token as string;
    const userId = login.body.userId as string;
    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);

    const response = await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId, levelId: 'level-1', score: 100, moves: 1, timeInSeconds: 5, completed: true });

    expect(response.status).toBe(200);
    expectSameKeys(response.body, fixture);
  });

  it('should_return_a_progress_get_response_matching_the_shared_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture<{ levels: object[] }>('progress-get-response.json');
    await request(app).post('/auth/register').send({ username: 'contract_progress', password: 'super-secret' });
    const login = await request(app).post('/auth/login').send({ username: 'contract_progress', password: 'super-secret' });
    const token = login.body.token as string;
    const userId = login.body.userId as string;
    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);
    await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId, levelId: 'level-1', score: 100, moves: 1, timeInSeconds: 5, completed: true });

    const response = await request(app).get('/progress').set(bearerHeader(token));

    expect(response.status).toBe(200);
    expectSameKeys(response.body, fixture);
    expect(response.body.levels).toHaveLength(1);
    expectSameKeys(response.body.levels[0], fixture.levels[0]);
  });

  it('should_return_a_leaderboard_response_matching_the_shared_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture<object[]>('leaderboard-response.json');
    const token = await obtainAuthToken(app, 'contract_leaderboard');
    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);
    await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId: 'u1', levelId: 'level-1', score: 100, moves: 1, timeInSeconds: 5, completed: true });

    const response = await request(app).get('/leaderboard/level-1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expectSameKeys(response.body[0], fixture[0]);
  });
});

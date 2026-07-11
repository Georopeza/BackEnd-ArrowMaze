import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { z, ZodError } from 'zod';
import { createServer } from '../../src/infrastructure/http/server';
import { bearerHeader, obtainAuthToken } from '../support/authTestHelper';
import {
  authLoginResponseSchema,
  authRegisterResponseSchema,
  errorResponseSchema,
  leaderboardResponseSchema,
  levelsGetResponseSchema,
  progressGetResponseSchema,
  progressResultSchema,
} from '../support/contractSchemas';

/**
 * Pruebas de contrato: verifican que las respuestas/peticiones REALES de la
 * API (no una re-implementación de su forma) coinciden con los fixtures
 * compartidos bit-a-bit con `Arrow-Maze-Escape-Puzzle/docs/contract/fixtures/`
 * (ver `docs/contract/fixtures/README.md` para la justificación de este
 * enfoque en vez de Pact).
 *
 * Cada fixture de respuesta se valida con `schema.parse(...)`, que
 * comprueba TIPOS y ausencia de campos extra (`.strict()`), no solo el
 * conjunto de claves — y se ejecuta tanto sobre el fixture (el fixture
 * mismo debe ser un ejemplo válido del contrato) como sobre la respuesta
 * real del servidor (el servidor debe seguir produciendo esa forma).
 */

const fixturesDir = path.join(__dirname, '../../docs/contract/fixtures');

function loadFixture<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(path.join(fixturesDir, fileName), 'utf-8'));
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

describe('Contract fixtures — progress/sync request', () => {
  it('should_accept_the_shared_progress_sync_request_fixture', () => {
    const fixture = loadFixture('progress-sync-request.json');

    expect(() => syncProgressSchema.parse(fixture)).not.toThrow();
  });

  it('should_reject_a_progress_sync_request_missing_a_field_from_the_fixture', () => {
    const fixture = loadFixture<Record<string, unknown>>('progress-sync-request.json');
    const { completed: _completed, ...withoutCompleted } = fixture;

    expect(() => syncProgressSchema.parse(withoutCompleted)).toThrow(ZodError);
  });
});

describe('Contract fixtures — auth', () => {
  it('should_return_a_register_response_matching_the_shared_fixture_type_and_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('auth-register-response.json');
    authRegisterResponseSchema.parse(fixture);

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'contract_register', password: 'super-secret' });

    expect(response.status).toBe(201);
    authRegisterResponseSchema.parse(response.body);
  });

  it('should_return_a_login_response_matching_the_shared_fixture_type_and_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('auth-login-response.json');
    authLoginResponseSchema.parse(fixture);
    await request(app).post('/auth/register').send({ username: 'contract_login', password: 'super-secret' });

    const response = await request(app)
      .post('/auth/login')
      .send({ username: 'contract_login', password: 'super-secret' });

    expect(response.status).toBe(200);
    authLoginResponseSchema.parse(response.body);
  });
});

describe('Contract fixtures — progress', () => {
  it('should_return_a_progress_sync_response_matching_the_shared_fixture_type_and_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('progress-sync-response.json');
    progressResultSchema.parse(fixture);
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
    progressResultSchema.parse(response.body);
  });

  it('should_return_a_progress_get_response_matching_the_shared_fixture_type_and_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('progress-get-response.json');
    progressGetResponseSchema.parse(fixture);
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
    progressGetResponseSchema.parse(response.body);
    expect(response.body.levels).toHaveLength(1);
  });
});

describe('Contract fixtures — leaderboard', () => {
  it('should_return_a_leaderboard_response_matching_the_shared_fixture_type_and_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('leaderboard-response.json');
    leaderboardResponseSchema.parse(fixture);
    const token = await obtainAuthToken(app, 'contract_leaderboard');
    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);
    await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId: 'u1', levelId: 'level-1', score: 100, moves: 1, timeInSeconds: 5, completed: true });

    const response = await request(app).get('/leaderboard/level-1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    leaderboardResponseSchema.parse(response.body);
  });
});

describe('Contract fixtures — GET /levels', () => {
  it('should_return_a_levels_response_matching_the_shared_fixture_exactly', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('levels-get-response.json');
    levelsGetResponseSchema.parse(fixture);
    const token = await obtainAuthToken(app, 'contract_levels');
    // El fixture representa exactamente el nivel que produce este PUT: mismo
    // payload de entrada que `solvableLevelDto` más el `name` del contrato.
    await request(app)
      .put('/levels/level-1')
      .set(bearerHeader(token))
      .send({ ...solvableLevelDto, name: 'Contract Test Level' });

    const response = await request(app).get('/levels');

    expect(response.status).toBe(200);
    levelsGetResponseSchema.parse(response.body);
    expect(response.body).toEqual(fixture);
  });
});

describe('Contract fixtures — error envelope', () => {
  it('should_return_a_401_response_matching_the_shared_error_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('error-401-unauthorized.json');
    errorResponseSchema.parse(fixture);

    // Ruta protegida sin token: mismo escenario 401 que documenta el fixture
    // (mensaje exacto puede variar según la causa; se valida la FORMA).
    const response = await request(app).get('/progress');

    expect(response.status).toBe(401);
    errorResponseSchema.parse(response.body);
  });

  it('should_return_a_409_response_matching_the_shared_error_fixture_shape', async () => {
    const app = await createServer('test-secret');
    const fixture = loadFixture('error-409-user-already-exists.json');
    errorResponseSchema.parse(fixture);
    await request(app).post('/auth/register').send({ username: 'contract_duplicate', password: 'super-secret' });

    const response = await request(app)
      .post('/auth/register')
      .send({ username: 'contract_duplicate', password: 'super-secret' });

    expect(response.status).toBe(409);
    errorResponseSchema.parse(response.body);
  });
});

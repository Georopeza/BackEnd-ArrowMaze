import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';
import { bearerHeader, obtainAuthToken } from '../support/authTestHelper';

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

describe('Progress and leaderboard routes', () => {
  it('should_return_401_when_syncing_progress_without_jwt', async () => {
    const app = await createServer('test-secret');

    const response = await request(app)
      .post('/progress/sync')
      .send({ userId: 'u1', levelId: 'missing-level', score: 100, moves: 3, timeInSeconds: 10, completed: true });

    expect(response.status).toBe(401);
  });

  it('should_return_404_when_syncing_progress_for_a_level_that_does_not_exist', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'progress_404');

    const response = await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId: 'u1', levelId: 'missing-level', score: 100, moves: 3, timeInSeconds: 10, completed: true });

    expect(response.status).toBe(404);
  });

  it('should_return_400_when_sync_body_is_invalid', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'progress_400');

    const response = await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId: 'u1' });

    expect(response.status).toBe(400);
  });

  it('should_sync_progress_and_reflect_it_in_the_leaderboard', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'progress_ok');
    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);
    await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId: 'u1', levelId: 'level-1', score: 100, moves: 1, timeInSeconds: 5, completed: true });

    const response = await request(app).get('/leaderboard/level-1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].highScore).toBe(100);
  });

  it('should_break_leaderboard_ties_by_time_then_by_moves_when_scores_match', async () => {
    // El puntaje es determinístico (cada flecha otorga los mismos puntos
    // fijos), así que todo jugador que completa el nivel empata en score.
    // El desempate real debe ser por tiempo (menos segundos gana) y, si aún
    // empatan, por movimientos (menos movimientos gana) — no por orden de
    // inserción en la base de datos.
    const app = await createServer('test-secret');
    const setupToken = await obtainAuthToken(app, 'tiebreak_setup');
    await request(app)
      .put('/levels/level-tiebreak')
      .set(bearerHeader(setupToken))
      .send({ ...solvableLevelDto, id: 'level-tiebreak' });

    async function registerAndSync(username: string, timeInSeconds: number): Promise<void> {
      await request(app).post('/auth/register').send({ username, password: 'super-secret' });
      const login = await request(app).post('/auth/login').send({ username, password: 'super-secret' });
      const token = login.body.token as string;
      const userId = login.body.userId as string;

      await request(app)
        .post('/progress/sync')
        .set(bearerHeader(token))
        .send({ userId, levelId: 'level-tiebreak', score: 100, moves: 3, timeInSeconds, completed: true });
    }

    // Insertados deliberadamente fuera de orden: el más lento primero.
    await registerAndSync('tiebreak_slowest', 12);
    await registerAndSync('tiebreak_fastest', 5);
    await registerAndSync('tiebreak_middle', 8);

    const response = await request(app).get('/leaderboard/level-tiebreak');

    expect(response.status).toBe(200);
    expect(response.body.map((entry: { username: string }) => entry.username)).toEqual([
      'tiebreak_fastest',
      'tiebreak_middle',
      'tiebreak_slowest',
    ]);
    expect(response.body.map((entry: { minTimeInSeconds: number }) => entry.minTimeInSeconds)).toEqual([5, 8, 12]);
  });

  it('should_return_401_when_getting_progress_without_jwt', async () => {
    const app = await createServer('test-secret');

    const response = await request(app).get('/progress');

    expect(response.status).toBe(401);
  });

  it('should_return_the_authenticated_users_synced_progress', async () => {
    const app = await createServer('test-secret');

    // Registro + login capturando el userId real que lleva el JWT.
    await request(app).post('/auth/register').send({ username: 'progress_pull', password: 'super-secret' });
    const login = await request(app).post('/auth/login').send({ username: 'progress_pull', password: 'super-secret' });
    const token = login.body.token as string;
    const userId = login.body.userId as string;

    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);
    await request(app)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId, levelId: 'level-1', score: 250, moves: 2, timeInSeconds: 8, completed: true });

    const response = await request(app).get('/progress').set(bearerHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.userId).toBe(userId);
    expect(response.body.levels).toHaveLength(1);
    expect(response.body.levels[0]).toMatchObject({
      levelId: 'level-1',
      highScore: 250,
      isCompleted: true,
    });
  });

  it('should_return_empty_progress_for_a_user_who_has_not_synced_anything', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'progress_empty');

    const response = await request(app).get('/progress').set(bearerHeader(token));

    expect(response.status).toBe(200);
    expect(response.body.levels).toEqual([]);
  });
});

import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';
import { bearerHeader, obtainAuthToken } from '../support/authTestHelper';

const solvableLevelDto = {
  levelNumber: 1,
  difficulty: 'EASY',
  maxMoves: 5,
  maxTimeInSeconds: 60,
  width: 2,
  height: 1,
  exit: { row: 0, col: 1 },
  arrows: [{ id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] }],
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
});

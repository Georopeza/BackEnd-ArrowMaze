import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';

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
  it('should_return_404_when_syncing_progress_for_a_level_that_does_not_exist', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app)
      .post('/progress/sync')
      .send({ userId: 'u1', levelId: 'missing-level', score: 100, moves: 3, timeInSeconds: 10, completed: true });

    // Assert
    expect(response.status).toBe(404);
  });

  it('should_return_400_when_sync_body_is_invalid', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app).post('/progress/sync').send({ userId: 'u1' });

    // Assert
    expect(response.status).toBe(400);
  });

  it('should_sync_progress_and_reflect_it_in_the_leaderboard', async () => {
    // Arrange
    const app = createServer('test-secret');
    await request(app).put('/levels/level-1').send(solvableLevelDto);
    await request(app)
      .post('/progress/sync')
      .send({ userId: 'u1', levelId: 'level-1', score: 100, moves: 1, timeInSeconds: 5, completed: true });

    // Act
    const response = await request(app).get('/leaderboard/level-1');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].highScore).toBe(100);
  });
});

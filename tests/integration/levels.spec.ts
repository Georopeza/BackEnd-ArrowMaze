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

const unsolvableLevelDto = {
  ...solvableLevelDto,
  arrows: [
    { id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [] },
    { id: 'f2', direction: 'LEFT', head: { row: 0, col: 1 }, body: [] },
  ],
};

describe('Levels routes', () => {
  it('should_create_a_level_when_it_is_solvable', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app).put('/levels/level-1').send(solvableLevelDto);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.id).toBe('level-1');
  });

  it('should_return_422_when_the_level_is_not_solvable', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app).put('/levels/level-2').send(unsolvableLevelDto);

    // Assert
    expect(response.status).toBe(422);
  });

  it('should_list_previously_created_levels', async () => {
    // Arrange
    const app = createServer('test-secret');
    await request(app).put('/levels/level-1').send(solvableLevelDto);

    // Act
    const response = await request(app).get('/levels');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should_return_404_when_getting_a_level_that_does_not_exist', async () => {
    // Arrange
    const app = createServer('test-secret');

    // Act
    const response = await request(app).get('/levels/missing-level');

    // Assert
    expect(response.status).toBe(404);
  });
});

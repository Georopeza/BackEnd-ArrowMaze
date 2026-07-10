import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';
import { bearerHeader, obtainAuthToken } from '../support/authTestHelper';

const solvableLevelDto = {
  levelNumber: 99,
  difficulty: 'EASY',
  maxMoves: 5,
  maxTimeInSeconds: 60,
  width: 3,
  height: 1,
  exit: { row: 0, col: 2 },
  arrows: [{ id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 1 }] }],
};

describe('Levels routes', () => {
  it('should_create_a_level_when_it_is_solvable', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'levels_writer');

    const response = await request(app)
      .put('/levels/level-1')
      .set(bearerHeader(token))
      .send(solvableLevelDto);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe('level-1');
  });

  it('should_return_401_when_creating_a_level_without_jwt', async () => {
    const app = await createServer('test-secret');

    const response = await request(app).put('/levels/level-1').send(solvableLevelDto);

    expect(response.status).toBe(401);
  });

  it('should_return_422_when_the_level_is_not_solvable', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'levels_writer_422');
    const unsolvableLevelDto = {
      ...solvableLevelDto,
      width: 4,
      arrows: [
        { id: 'f1', direction: 'RIGHT', head: { row: 0, col: 0 }, body: [{ row: 0, col: 3 }] },
        { id: 'f2', direction: 'LEFT', head: { row: 0, col: 1 }, body: [{ row: 0, col: 2 }] },
      ],
    };

    const response = await request(app)
      .put('/levels/level-2')
      .set(bearerHeader(token))
      .send(unsolvableLevelDto);

    expect(response.status).toBe(422);
  });

  it('should_list_previously_created_levels', async () => {
    const app = await createServer('test-secret');
    const token = await obtainAuthToken(app, 'levels_lister');
    await request(app).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);

    const response = await request(app).get('/levels');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should_return_404_when_getting_a_level_that_does_not_exist', async () => {
    const app = await createServer('test-secret');

    const response = await request(app).get('/levels/missing-level');

    expect(response.status).toBe(404);
  });
});

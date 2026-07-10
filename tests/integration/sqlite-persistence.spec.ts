import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import request from 'supertest';
import { createServer } from '../../src/infrastructure/http/server';
import { bearerHeader } from '../support/authTestHelper';

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

/**
 * Verifica que la persistencia SQLite sobrevive un "reinicio del proceso":
 * cada `createServer` de este archivo abre su propia conexión a la base
 * (`better-sqlite3` no comparte handles entre instancias), simulando que el
 * servidor se apagó y volvió a arrancar apuntando al mismo archivo `.db`.
 */
describe('SQLite persistence across process restarts', () => {
  let dbPath: string;

  beforeEach(() => {
    dbPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'arrowmaze-db-')), 'test.db');
  });

  afterEach(() => {
    // Cada test abre 2+ conexiones better-sqlite3 sobre el mismo archivo sin
    // cerrarlas (no hay API pública para eso desde `createServer`); en
    // Windows el handle nativo puede seguir abierto cuando corre este
    // cleanup, así que un unlink inmediato falla con EBUSY. No es relevante
    // para lo que el test verifica (que los datos persistieron entre
    // "arranques"), así que se ignora — el directorio temporal igual queda
    // sujeto a la limpieza normal del SO.
    try {
      fs.rmSync(path.dirname(dbPath), { recursive: true, force: true });
    } catch {
      // Ignorado deliberadamente; ver comentario arriba.
    }
  });

  it('should_keep_registered_user_available_after_restart', async () => {
    // Arrange: "arranque 1" registra un usuario.
    const firstBoot = await createServer('test-secret', { dbPath });
    await request(firstBoot).post('/auth/register').send({ username: 'persisted_user', password: 'super-secret' });

    // Act: "arranque 2" — nueva instancia de servidor sobre el mismo archivo.
    const secondBoot = await createServer('test-secret', { dbPath });
    const login = await request(secondBoot)
      .post('/auth/login')
      .send({ username: 'persisted_user', password: 'super-secret' });

    // Assert: el usuario sigue existiendo, login funciona sin volver a registrar.
    expect(login.status).toBe(200);
    expect(login.body.username).toBe('persisted_user');
  });

  it('should_keep_uploaded_level_available_after_restart', async () => {
    // Arrange
    const firstBoot = await createServer('test-secret', { dbPath });
    const token = (
      await request(firstBoot).post('/auth/register').send({ username: 'level_owner', password: 'super-secret' })
    ).body;
    const login = await request(firstBoot)
      .post('/auth/login')
      .send({ username: 'level_owner', password: 'super-secret' });
    await request(firstBoot).put('/levels/persisted-level').set(bearerHeader(login.body.token)).send(solvableLevelDto);
    void token;

    // Act
    const secondBoot = await createServer('test-secret', { dbPath });
    const response = await request(secondBoot).get('/levels/persisted-level');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.id).toBe('persisted-level');
  });

  it('should_keep_synced_progress_available_after_restart', async () => {
    // Arrange: arranque 1 registra, sube nivel y sincroniza progreso.
    const firstBoot = await createServer('test-secret', { dbPath });
    await request(firstBoot).post('/auth/register').send({ username: 'progress_owner', password: 'super-secret' });
    const login = await request(firstBoot)
      .post('/auth/login')
      .send({ username: 'progress_owner', password: 'super-secret' });
    const token = login.body.token as string;
    const userId = login.body.userId as string;

    await request(firstBoot).put('/levels/level-1').set(bearerHeader(token)).send(solvableLevelDto);
    await request(firstBoot)
      .post('/progress/sync')
      .set(bearerHeader(token))
      .send({ userId, levelId: 'level-1', score: 300, moves: 2, timeInSeconds: 6, completed: true });

    // Act: arranque 2, mismo login (el usuario también sobrevivió), consulta progreso.
    const secondBoot = await createServer('test-secret', { dbPath });
    const secondLogin = await request(secondBoot)
      .post('/auth/login')
      .send({ username: 'progress_owner', password: 'super-secret' });
    const response = await request(secondBoot).get('/progress').set(bearerHeader(secondLogin.body.token));

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.levels).toHaveLength(1);
    expect(response.body.levels[0]).toMatchObject({ levelId: 'level-1', highScore: 300, isCompleted: true });
  });
});

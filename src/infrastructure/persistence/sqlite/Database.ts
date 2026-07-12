import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

/**
 * Abre (creando si hace falta) la base de datos SQLite del backend y
 * garantiza el esquema mínimo de las tres tablas.
 *
 * `dbPath` puede ser `:memory:` (usado por tests: cada llamada abre una base
 * efímera y aislada) o una ruta de archivo real (usado en producción vía
 * `main.ts`, sobrevive reinicios del proceso).
 */
export function createDatabase(dbPath: string): Database.Database {
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS levels (
      id TEXT PRIMARY KEY,
      levelNumber INTEGER NOT NULL,
      dto TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      levelId TEXT NOT NULL,
      highScore INTEGER NOT NULL,
      minMoves INTEGER NOT NULL,
      minTimeInSeconds INTEGER NOT NULL,
      isCompleted INTEGER NOT NULL,
      UNIQUE (userId, levelId)
    );

    CREATE TABLE IF NOT EXISTS user_collectibles (
      userId TEXT NOT NULL,
      collectibleId TEXT NOT NULL,
      unlockedAt TEXT NOT NULL,
      UNIQUE (userId, collectibleId),
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `);

  return db;
}

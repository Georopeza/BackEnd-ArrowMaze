import { Pool } from 'pg';

/**
 * Crea las tablas del backend si no existen (idempotente).
 *
 * Usa identificadores entre comillas para conservar camelCase y alinear
 * el esquema con la versión SQLite existente.
 */
export async function ensurePostgresSchema(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      "passwordHash" TEXT NOT NULL,
      "createdAt" TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS levels (
      id TEXT PRIMARY KEY,
      "levelNumber" INTEGER NOT NULL,
      dto TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL,
      "levelId" TEXT NOT NULL,
      "highScore" INTEGER NOT NULL,
      "minMoves" INTEGER NOT NULL,
      "minTimeInSeconds" INTEGER NOT NULL,
      "isCompleted" BOOLEAN NOT NULL,
      UNIQUE ("userId", "levelId")
    );

    CREATE TABLE IF NOT EXISTS user_collectibles (
      "userId" TEXT NOT NULL,
      "collectibleId" TEXT NOT NULL,
      "unlockedAt" TEXT NOT NULL,
      UNIQUE ("userId", "collectibleId"),
      FOREIGN KEY ("userId") REFERENCES users(id)
    );
  `);
}

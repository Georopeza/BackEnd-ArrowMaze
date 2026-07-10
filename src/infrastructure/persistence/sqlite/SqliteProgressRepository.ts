import { randomUUID } from 'node:crypto';
import Database from 'better-sqlite3';
import { IProgressRepository } from '../../../domain/repositories/IProgressRepository';
import { PlayerProgress } from '../../../domain/entities/PlayerProgress';
import { LeaderBoardEntry } from '../../../domain/value-objects/LeaderBoardEntry';

interface ProgressRow {
  id: string;
  userId: string;
  levelId: string;
  highScore: number;
  minMoves: number;
  minTimeInSeconds: number;
  isCompleted: number;
}

/**
 * Implementación de `IProgressRepository` respaldada por SQLite.
 *
 * El leaderboard se resuelve con un único `JOIN` contra `users` (en vez de
 * inyectar `IUserRepository` y hacer una consulta por fila, como hacía la
 * versión in-memory) — SQL ya resuelve esa relación de forma más simple.
 */
export class SqliteProgressRepository implements IProgressRepository {
  constructor(private readonly db: Database.Database) {}

  public async findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null> {
    const row = this.db
      .prepare('SELECT * FROM progress WHERE userId = ? AND levelId = ?')
      .get(userId, levelId) as ProgressRow | undefined;
    return row ? this.toDomain(row) : null;
  }

  public async findAllByUser(userId: string): Promise<PlayerProgress[]> {
    const rows = this.db.prepare('SELECT * FROM progress WHERE userId = ?').all(userId) as ProgressRow[];
    return rows.map(row => this.toDomain(row));
  }

  public async save(progress: PlayerProgress): Promise<void> {
    const id = progress.id || randomUUID();
    this.db
      .prepare(
        `INSERT INTO progress (id, userId, levelId, highScore, minMoves, minTimeInSeconds, isCompleted)
         VALUES (@id, @userId, @levelId, @highScore, @minMoves, @minTimeInSeconds, @isCompleted)
         ON CONFLICT(userId, levelId) DO UPDATE SET
           highScore = excluded.highScore,
           minMoves = excluded.minMoves,
           minTimeInSeconds = excluded.minTimeInSeconds,
           isCompleted = excluded.isCompleted`,
      )
      .run({
        id,
        userId: progress.userId,
        levelId: progress.levelId,
        highScore: progress.highScore,
        minMoves: progress.minMoves,
        minTimeInSeconds: progress.minTimeInSeconds,
        isCompleted: progress.isCompleted ? 1 : 0,
      });
  }

  public async getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]> {
    const rows = this.db
      .prepare(
        `SELECT p.highScore as highScore, p.minMoves as minMoves, p.minTimeInSeconds as minTimeInSeconds,
                COALESCE(u.username, p.userId) as username
         FROM progress p
         LEFT JOIN users u ON u.id = p.userId
         WHERE p.levelId = ?
         ORDER BY p.highScore DESC
         LIMIT ?`,
      )
      .all(levelId, limit) as Array<{
      username: string;
      highScore: number;
      minMoves: number;
      minTimeInSeconds: number;
    }>;

    return rows.map(row => new LeaderBoardEntry(row.username, row.highScore, row.minMoves, row.minTimeInSeconds));
  }

  private toDomain(row: ProgressRow): PlayerProgress {
    return new PlayerProgress(
      row.id,
      row.userId,
      row.levelId,
      row.highScore,
      row.minMoves,
      row.minTimeInSeconds,
      row.isCompleted === 1,
    );
  }
}

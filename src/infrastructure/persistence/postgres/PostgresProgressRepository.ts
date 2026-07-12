import { randomUUID } from 'node:crypto';

import { Pool } from 'pg';

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
  isCompleted: boolean;
}

/** Implementación de [IProgressRepository] respaldada por PostgreSQL (Neon). */
export class PostgresProgressRepository implements IProgressRepository {
  /** @param pool Pool de conexiones ya inicializado. */
  constructor(private readonly pool: Pool) {}

  /** @inheritdoc */
  public async findByUserAndLevel(userId: string, levelId: string): Promise<PlayerProgress | null> {
    const result = await this.pool.query<ProgressRow>(
      'SELECT * FROM progress WHERE "userId" = $1 AND "levelId" = $2',
      [userId, levelId],
    );
    const row = result.rows[0];
    return row ? this.toDomain(row) : null;
  }

  /** @inheritdoc */
  public async findAllByUser(userId: string): Promise<PlayerProgress[]> {
    const result = await this.pool.query<ProgressRow>(
      'SELECT * FROM progress WHERE "userId" = $1',
      [userId],
    );
    return result.rows.map(row => this.toDomain(row));
  }

  /** @inheritdoc */
  public async save(progress: PlayerProgress): Promise<void> {
    const id = progress.id || randomUUID();
    await this.pool.query(
      `INSERT INTO progress (id, "userId", "levelId", "highScore", "minMoves", "minTimeInSeconds", "isCompleted")
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT ("userId", "levelId") DO UPDATE SET
         "highScore" = EXCLUDED."highScore",
         "minMoves" = EXCLUDED."minMoves",
         "minTimeInSeconds" = EXCLUDED."minTimeInSeconds",
         "isCompleted" = EXCLUDED."isCompleted"`,
      [
        id,
        progress.userId,
        progress.levelId,
        progress.highScore,
        progress.minMoves,
        progress.minTimeInSeconds,
        progress.isCompleted,
      ],
    );
  }

  /** @inheritdoc */
  public async getLeaderboardByLevel(levelId: string, limit: number): Promise<LeaderBoardEntry[]> {
    const result = await this.pool.query<{
      username: string;
      highScore: number;
      minMoves: number;
      minTimeInSeconds: number;
    }>(
      `SELECT p."highScore" as "highScore", p."minMoves" as "minMoves",
              p."minTimeInSeconds" as "minTimeInSeconds",
              COALESCE(u.username, p."userId") as username
       FROM progress p
       LEFT JOIN users u ON u.id = p."userId"
       WHERE p."levelId" = $1
       ORDER BY p."highScore" DESC, p."minTimeInSeconds" ASC, p."minMoves" ASC
       LIMIT $2`,
      [levelId, limit],
    );

    return result.rows.map(
      row => new LeaderBoardEntry(row.username, row.highScore, row.minMoves, row.minTimeInSeconds),
    );
  }

  private toDomain(row: ProgressRow): PlayerProgress {
    return new PlayerProgress(
      row.id,
      row.userId,
      row.levelId,
      row.highScore,
      row.minMoves,
      row.minTimeInSeconds,
      row.isCompleted,
    );
  }
}

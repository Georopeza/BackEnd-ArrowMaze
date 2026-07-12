import { Pool } from 'pg';

import { ICollectibleRepository } from '../../../domain/repositories/ICollectibleRepository';

interface CollectibleRow {
  collectibleId: string;
}

/** Implementación PostgreSQL de [ICollectibleRepository]. */
export class PostgresCollectibleRepository implements ICollectibleRepository {
  /** @param pool Pool de conexiones ya inicializado. */
  constructor(private readonly pool: Pool) {}

  /** @inheritdoc */
  public async findAllByUser(userId: string): Promise<string[]> {
    const result = await this.pool.query<CollectibleRow>(
      'SELECT "collectibleId" FROM user_collectibles WHERE "userId" = $1 ORDER BY "collectibleId"',
      [userId],
    );
    return result.rows.map(row => row.collectibleId);
  }

  /** @inheritdoc */
  public async mergeForUser(userId: string, collectibleIds: string[]): Promise<string[]> {
    const uniqueIds = [...new Set(collectibleIds)].sort();
    if (uniqueIds.length === 0) {
      return this.findAllByUser(userId);
    }

    const client = await this.pool.connect();
    const now = new Date().toISOString();

    try {
      await client.query('BEGIN');
      for (const collectibleId of uniqueIds) {
        await client.query(
          `INSERT INTO user_collectibles ("userId", "collectibleId", "unlockedAt")
           VALUES ($1, $2, $3)
           ON CONFLICT ("userId", "collectibleId") DO NOTHING`,
          [userId, collectibleId, now],
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return this.findAllByUser(userId);
  }
}

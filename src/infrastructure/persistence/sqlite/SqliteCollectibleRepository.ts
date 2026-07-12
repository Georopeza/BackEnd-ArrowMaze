import Database from 'better-sqlite3';
import { ICollectibleRepository } from '../../../domain/repositories/ICollectibleRepository';

interface CollectibleRow {
  collectibleId: string;
}

/**
 * Implementación SQLite de [ICollectibleRepository].
 */
export class SqliteCollectibleRepository implements ICollectibleRepository {
  /** @param db Conexión SQLite ya inicializada con el esquema de `user_collectibles`. */
  constructor(private readonly db: Database.Database) {}

  /** @inheritdoc */
  public async findAllByUser(userId: string): Promise<string[]> {
    const rows = this.db
      .prepare('SELECT collectibleId FROM user_collectibles WHERE userId = ? ORDER BY collectibleId')
      .all(userId) as CollectibleRow[];
    return rows.map(row => row.collectibleId);
  }

  /** @inheritdoc */
  public async mergeForUser(userId: string, collectibleIds: string[]): Promise<string[]> {
    const uniqueIds = [...new Set(collectibleIds)].sort();
    if (uniqueIds.length === 0) {
      return this.findAllByUser(userId);
    }

    const insert = this.db.prepare(
      `INSERT OR IGNORE INTO user_collectibles (userId, collectibleId, unlockedAt)
       VALUES (?, ?, ?)`,
    );

    const now = new Date().toISOString();
    const merge = this.db.transaction((ids: string[]) => {
      for (const collectibleId of ids) {
        insert.run(userId, collectibleId, now);
      }
    });

    merge(uniqueIds);
    return this.findAllByUser(userId);
  }
}

import Database from 'better-sqlite3';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

interface UserRow {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

/**
 * Implementación de `IUserRepository` respaldada por SQLite.
 *
 * Persiste en la tabla `users`, sobreviviendo reinicios del proceso.
 * `better-sqlite3` es síncrono, por eso los métodos son `async` solo para
 * cumplir el contrato del puerto de dominio.
 */
export class SqliteUserRepository implements IUserRepository {
  constructor(private readonly db: Database.Database) {}

  public async findById(id: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
    return row ? this.toDomain(row) : null;
  }

  public async findByUsername(username: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE username = ?').get(username) as
      | UserRow
      | undefined;
    return row ? this.toDomain(row) : null;
  }

  public async save(user: User): Promise<void> {
    const record = user.toPersistenceRecord();
    this.db
      .prepare(
        `INSERT INTO users (id, username, passwordHash, createdAt)
         VALUES (@id, @username, @passwordHash, @createdAt)
         ON CONFLICT(id) DO UPDATE SET
           username = excluded.username,
           passwordHash = excluded.passwordHash,
           createdAt = excluded.createdAt`,
      )
      .run({ ...record, createdAt: record.createdAt.toISOString() });
  }

  private toDomain(row: UserRow): User {
    return new User(row.id, row.username, row.passwordHash, new Date(row.createdAt));
  }
}

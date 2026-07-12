import { Pool } from 'pg';

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

interface UserRow {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

/** Implementación de [IUserRepository] respaldada por PostgreSQL (Neon). */
export class PostgresUserRepository implements IUserRepository {
  /** @param pool Pool de conexiones ya inicializado con el esquema aplicado. */
  constructor(private readonly pool: Pool) {}

  /** @inheritdoc */
  public async findById(id: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>('SELECT * FROM users WHERE id = $1', [id]);
    const row = result.rows[0];
    return row ? this.toDomain(row) : null;
  }

  /** @inheritdoc */
  public async findByUsername(username: string): Promise<User | null> {
    const result = await this.pool.query<UserRow>('SELECT * FROM users WHERE username = $1', [username]);
    const row = result.rows[0];
    return row ? this.toDomain(row) : null;
  }

  /** @inheritdoc */
  public async save(user: User): Promise<void> {
    const record = user.toPersistenceRecord();
    await this.pool.query(
      `INSERT INTO users (id, username, "passwordHash", "createdAt")
       VALUES ($1, $2, $3, $4)
       ON CONFLICT(id) DO UPDATE SET
         username = EXCLUDED.username,
         "passwordHash" = EXCLUDED."passwordHash",
         "createdAt" = EXCLUDED."createdAt"`,
      [record.id, record.username, record.passwordHash, record.createdAt.toISOString()],
    );
  }

  private toDomain(row: UserRow): User {
    return new User(row.id, row.username, row.passwordHash, new Date(row.createdAt));
  }
}

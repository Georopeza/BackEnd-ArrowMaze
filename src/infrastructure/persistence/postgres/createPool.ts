import { Pool } from 'pg';

import { ensurePostgresSchema } from './ensureSchema';

/**
 * Abre un pool hacia Neon/PostgreSQL, aplica el esquema mínimo y lo devuelve listo.
 *
 * @param databaseUrl Connection string (`postgresql://...?sslmode=require` en Neon).
 */
export async function createPostgresPool(databaseUrl: string): Promise<Pool> {
  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('sslmode=require') || databaseUrl.includes('neon.tech')
      ? { rejectUnauthorized: false }
      : undefined,
  });

  await ensurePostgresSchema(pool);
  return pool;
}

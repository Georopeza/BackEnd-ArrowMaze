import 'dotenv/config';
import path from 'node:path';
import { createServer } from './infrastructure/http/server';

/**
 * Arranque del proceso HTTP: crea la app (con seed de niveles), escucha en `PORT`.
 *
 * Persistencia:
 * - Si `DATABASE_URL` está definida → PostgreSQL (Neon): usuarios, progreso y
 *   coleccionables sobreviven redeploys en Render.
 * - Si no → SQLite en `DB_PATH` (desarrollo local sin Neon).
 *
 * El catálogo se inserta vía `seedLevelCatalog` antes de aceptar peticiones;
 * cada nivel vive en `levels/*.json`.
 */
async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const jwtSecret = process.env.JWT_SECRET ?? 'change-me-in-production';
  const databaseUrl = process.env.DATABASE_URL;
  const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'arrowmaze.db');

  const app = await createServer(jwtSecret, {
    seedLevels: true,
    watchLevelCatalog: true,
    databaseUrl,
    dbPath: databaseUrl ? undefined : dbPath,
  });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Arrow Maze backend listening on port ${port}`);
    if (databaseUrl) {
      // eslint-disable-next-line no-console
      console.log('Persistence: PostgreSQL (DATABASE_URL)');
    } else {
      // eslint-disable-next-line no-console
      console.log(`Persistence: SQLite (${dbPath})`);
    }
  });
}

void bootstrap();

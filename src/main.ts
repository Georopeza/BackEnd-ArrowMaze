import 'dotenv/config';
import path from 'node:path';
import { createServer } from './infrastructure/http/server';

/**
 * Arranque del proceso HTTP: crea la app (con seed de 15 niveles), escucha en `PORT`.
 *
 * El catálogo se inserta vía `seedLevelCatalog` antes de aceptar peticiones;
 * ver `LEVEL_SEED_CATALOG` en `infrastructure/persistence/seed/`.
 *
 * `DB_PATH` apunta a un archivo SQLite real (por defecto `data/arrowmaze.db`
 * en la raíz del proyecto) para que usuarios, niveles y progreso sobrevivan
 * reinicios del proceso — a diferencia de los tests, que usan `:memory:`.
 */
async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const jwtSecret = process.env.JWT_SECRET ?? 'change-me-in-production';
  const dbPath = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'arrowmaze.db');

  const app = await createServer(jwtSecret, { seedLevels: true, dbPath });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Arrow Maze backend listening on port ${port}`);
  });
}

void bootstrap();

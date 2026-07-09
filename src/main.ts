import 'dotenv/config';
import { createServer } from './infrastructure/http/server';

/**
 * Arranque del proceso HTTP: crea la app (con seed de 15 niveles), escucha en `PORT`.
 *
 * El catálogo se inserta vía `seedLevelCatalog` antes de aceptar peticiones;
 * ver `LEVEL_SEED_CATALOG` en `infrastructure/persistence/seed/`.
 */
async function bootstrap(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000);
  const jwtSecret = process.env.JWT_SECRET ?? 'change-me-in-production';

  const app = await createServer(jwtSecret, { seedLevels: true });

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Arrow Maze backend listening on port ${port}`);
  });
}

void bootstrap();

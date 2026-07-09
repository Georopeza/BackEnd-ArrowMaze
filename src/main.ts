import 'dotenv/config';
import { createServer } from './infrastructure/http/server';

/**
 * Arranque del proceso HTTP: crea la app (con seed de niveles), escucha en `PORT`.
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

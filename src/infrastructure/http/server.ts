import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { healthRouter } from './routes/health.routes';
import { createAuthRouter } from './routes/auth.routes';
import { createProgressRouter } from './routes/progress.routes';
import { createLeaderboardRouter } from './routes/leaderboard.routes';
import { createLevelsRouter } from './routes/levels.routes';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { createContainer } from './container';
import openapiDocument from './openapi/openapi.json';

/**
 * Crea y configura la aplicación Express (composition root de HTTP).
 *
 * No la inicia (`listen`); eso lo hace `src/main.ts`, para poder importar
 * y probar esta función directamente con supertest sin abrir un puerto.
 *
 * El `jwtSecret` se recibe por parámetro (en vez de leer `process.env`
 * aquí) para que los tests de integración puedan levantar el servidor con
 * un secreto de prueba sin depender de variables de entorno globales.
 */
export function createServer(jwtSecret: string = process.env.JWT_SECRET ?? 'test-secret'): Express {
  const app = express();
  const container = createContainer(jwtSecret);

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLoggerMiddleware);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.use(healthRouter);
  app.use(createAuthRouter(container));
  app.use(createProgressRouter(container));
  app.use(createLeaderboardRouter(container));
  app.use(createLevelsRouter(container));

  app.use(errorHandlerMiddleware);

  return app;
}

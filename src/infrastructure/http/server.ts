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
import { createAuthMiddleware } from './middlewares/auth.middleware';
import { AppContainer, createContainer } from './container';
import { seedLevelCatalog } from '../persistence/seed/seedLevelCatalog';
import openapiDocument from './openapi/openapi.json';

/** Opciones de arranque del servidor (útiles en tests vs producción). */
export interface CreateServerOptions {
  /**
   * Si es `true`, inserta [LEVEL_SEED_CATALOG] en el repositorio in-memory
   * antes de registrar rutas. Por defecto `false` para no alterar tests.
   */
  seedLevels?: boolean;
}

/**
 * Crea y configura la aplicación Express (composition root de HTTP).
 *
 * Aspectos transversales (AOP) registrados aquí:
 * 1. Logging — `requestLoggerMiddleware`
 * 2. Errores — `errorHandlerMiddleware`
 * 3. Autorización JWT — `createAuthMiddleware` en rutas protegidas
 *
 * @param jwtSecret Secreto para firmar/verificar tokens.
 * @param options Ver [CreateServerOptions].
 */
export async function createServer(
  jwtSecret: string = process.env.JWT_SECRET ?? 'test-secret',
  options: CreateServerOptions = {},
): Promise<Express> {
  const container = createContainer(jwtSecret);

  if (options.seedLevels) {
    const result = await seedLevelCatalog(container);
    // eslint-disable-next-line no-console
    console.log(`Level seed: ${result.seeded}/${result.expected} niveles cargados`);
  }

  const authMiddleware = createAuthMiddleware(container.tokenService);
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLoggerMiddleware);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.use(healthRouter);
  app.use(createAuthRouter(container));
  app.use(createProgressRouter(container, authMiddleware));
  app.use(createLeaderboardRouter(container));
  app.use(createLevelsRouter(container, authMiddleware));

  app.use(errorHandlerMiddleware);

  return app;
}

/**
 * Expone el contenedor para tests que necesitan sembrar datos manualmente
 * sin levantar HTTP.
 */
export function createContainerForTests(jwtSecret = 'test-secret'): AppContainer {
  return createContainer(jwtSecret);
}

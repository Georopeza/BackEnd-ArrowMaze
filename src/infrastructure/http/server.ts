import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import './types/express-augment';
import { healthRouter } from './routes/health.routes';
import { createAuthRouter } from './routes/auth.routes';
import { createProgressRouter } from './routes/progress.routes';
import { createLeaderboardRouter } from './routes/leaderboard.routes';
import { createLevelsRouter } from './routes/levels.routes';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import { createAuthMiddleware } from './middlewares/auth.middleware';
import { AppContainer, createContainer } from './container';
import { seedLevelCatalog } from '../persistence/seed/seedLevelCatalog';
import { startLevelCatalogWatcher } from '../persistence/seed/startLevelCatalogWatcher';
import { LevelCatalogFileSubject } from '../persistence/seed/observers/LevelCatalogFileSubject';
import openapiDocument from './openapi/openapi.json';

/** Opciones de arranque del servidor (útiles en tests vs producción). */
export interface CreateServerOptions {
  /**
   * Si es `true`, inserta [LEVEL_SEED_CATALOG] en el repositorio antes de
   * registrar rutas. Por defecto `false` para no alterar tests.
   */
  seedLevels?: boolean;

  /**
   * Si es `true`, vigila `levels/*.json` y sincroniza SQLite al detectar cambios
   * (patrón Observer). Por defecto `false` en tests; `true` en `main.ts`.
   */
  watchLevelCatalog?: boolean;

  /**
   * Ruta del archivo SQLite. Por defecto `:memory:` (base efímera y aislada,
   * el valor correcto para tests). `main.ts` pasa una ruta de archivo real
   * para que los datos sobrevivan reinicios del proceso.
   */
  dbPath?: string;
}

/**
 * Crea y configura la aplicación Express (composition root de HTTP).
 *
 * Aspectos transversales (AOP) registrados aquí:
 * 1. Logging — `requestLoggerMiddleware`
 * 2. Errores — `notFoundMiddleware` (rutas no reconocidas) + `errorHandlerMiddleware`
 * 3. Autorización JWT — `createAuthMiddleware` en rutas protegidas
 *
 * @param jwtSecret Secreto para firmar/verificar tokens.
 * @param options Ver [CreateServerOptions].
 */
export async function createServer(
  jwtSecret: string = process.env.JWT_SECRET ?? 'test-secret',
  options: CreateServerOptions = {},
): Promise<Express> {
  const container = createContainer(jwtSecret, options.dbPath);

  if (options.seedLevels) {
    const result = await seedLevelCatalog(container);
    // eslint-disable-next-line no-console
    console.log(`Level seed: ${result.seeded}/${result.expected} niveles cargados`);
    if (result.failed.length > 0) {
      // eslint-disable-next-line no-console
      console.error(`Level seed: ${result.failed.length} nivel(es) omitidos por error:`);
      for (const failure of result.failed) {
        // eslint-disable-next-line no-console
        console.error(`  - ${failure.fileName}: ${failure.message}`);
      }
    }
  }

  let levelCatalogWatcher: LevelCatalogFileSubject | null = null;
  if (options.watchLevelCatalog) {
    levelCatalogWatcher = startLevelCatalogWatcher(container);
    // eslint-disable-next-line no-console
    console.log('Level catalog watcher: observing levels/*.json for hot reload');
  }

  const authMiddleware = createAuthMiddleware(container.tokenService);
  const app = express();

  if (levelCatalogWatcher) {
    app.locals.levelCatalogWatcher = levelCatalogWatcher;
  }

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

  app.use(notFoundMiddleware);
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

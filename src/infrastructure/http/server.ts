import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import { healthRouter } from './routes/health.routes';
import { requestLoggerMiddleware } from './middlewares/requestLogger.middleware';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware';
import openapiDocument from './openapi/openapi.json';

/**
 * Crea y configura la aplicación Express (composition root de HTTP).
 *
 * No la inicia (`listen`); eso lo hace `src/main.ts`, para poder importar
 * y probar esta función directamente con supertest sin abrir un puerto.
 */
export function createServer(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(requestLoggerMiddleware);

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));
  app.use(healthRouter);

  app.use(errorHandlerMiddleware);

  return app;
}

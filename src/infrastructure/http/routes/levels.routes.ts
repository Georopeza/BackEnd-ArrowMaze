import { RequestHandler, Router } from 'express';
import { AppContainer } from '../container';
import { asyncHandler } from '../asyncHandler';

/**
 * Rutas de catálogo de niveles (`StructuredLevelJsonDto`).
 *
 * - `GET /levels` y `GET /levels/:id` son **públicas** (la app lista niveles sin login).
 * - `PUT /levels/:id` está **protegida** por JWT (solo operadores autenticados crean/actualizan).
 */
export function createLevelsRouter(container: AppContainer, authMiddleware: RequestHandler): Router {
  const router = Router();

  router.get(
    '/levels',
    asyncHandler(async (_req, res) => {
      const levels = await container.listLevels.execute();
      res.status(200).json(levels);
    }),
  );

  router.get(
    '/levels/:id',
    asyncHandler(async (req, res) => {
      const level = await container.getLevel.execute(req.params.id);
      res.status(200).json(level);
    }),
  );

  router.put(
    '/levels/:id',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const level = await container.upsertLevel.execute({ ...req.body, id: req.params.id });
      res.status(200).json(level);
    }),
  );

  return router;
}

import { Router } from 'express';
import { AppContainer } from '../container';
import { asyncHandler } from '../asyncHandler';

/**
 * Rutas de niveles: listar, obtener uno y crear/actualizar (permite añadir
 * niveles nuevos sin publicar una nueva versión de la app cliente).
 */
export function createLevelsRouter(container: AppContainer): Router {
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
    asyncHandler(async (req, res) => {
      const level = await container.upsertLevel.execute({ ...req.body, id: req.params.id });
      res.status(200).json(level);
    }),
  );

  return router;
}

import { RequestHandler, Router } from 'express';
import { z } from 'zod';
import { AppContainer } from '../container';
import { asyncHandler } from '../asyncHandler';

/** Esquema Zod del body de `POST /progress/sync`. */
const syncProgressSchema = z.object({
  userId: z.string().min(1),
  levelId: z.string().min(1),
  score: z.number().int().nonnegative(),
  moves: z.number().int().nonnegative(),
  timeInSeconds: z.number().int().nonnegative(),
  completed: z.boolean(),
});

/**
 * Rutas de progreso del jugador.
 *
 * `POST /progress/sync` está protegida por JWT: requiere header
 * `Authorization: Bearer <token>` emitido en `/auth/login`.
 */
export function createProgressRouter(container: AppContainer, authMiddleware: RequestHandler): Router {
  const router = Router();

  router.post(
    '/progress/sync',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const dto = syncProgressSchema.parse(req.body);
      const result = await container.syncProgress.execute(dto);
      res.status(200).json(result);
    }),
  );

  return router;
}

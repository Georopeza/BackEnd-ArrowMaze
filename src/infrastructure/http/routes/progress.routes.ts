import { Router } from 'express';
import { z } from 'zod';
import { AppContainer } from '../container';
import { asyncHandler } from '../asyncHandler';

const syncProgressSchema = z.object({
  userId: z.string().min(1),
  levelId: z.string().min(1),
  score: z.number().int().nonnegative(),
  moves: z.number().int().nonnegative(),
  timeInSeconds: z.number().int().nonnegative(),
  completed: z.boolean(),
});

/** Ruta de progreso: sincroniza el resultado de una partida con el servidor. */
export function createProgressRouter(container: AppContainer): Router {
  const router = Router();

  router.post(
    '/progress/sync',
    asyncHandler(async (req, res) => {
      const dto = syncProgressSchema.parse(req.body);
      const result = await container.syncProgress.execute(dto);
      res.status(200).json(result);
    }),
  );

  return router;
}

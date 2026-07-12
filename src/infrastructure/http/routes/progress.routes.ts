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

/** Esquema Zod del body de `POST /progress/collectibles/sync`. */
const syncCollectiblesSchema = z.object({
  collectibleIds: z.array(z.string().min(1)),
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

  router.post(
    '/progress/collectibles/sync',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const dto = syncCollectiblesSchema.parse(req.body);
      const result = await container.syncCollectibles.execute(req.auth!.userId, dto.collectibleIds);
      res.status(200).json(result);
    }),
  );

  // `GET /progress` devuelve todo el progreso del usuario autenticado, para
  // que el cliente lo descargue y fusione al iniciar sesión desde un
  // dispositivo o sesión nueva. El `userId` se toma del JWT (`req.auth`),
  // nunca de un parámetro del cliente, para que un usuario no pueda leer el
  // progreso de otro.
  router.get(
    '/progress',
    authMiddleware,
    asyncHandler(async (req, res) => {
      const result = await container.getPlayerProgress.execute(req.auth!.userId);
      res.status(200).json(result);
    }),
  );

  return router;
}

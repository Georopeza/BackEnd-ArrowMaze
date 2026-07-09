import { Router } from 'express';
import { AppContainer } from '../container';
import { asyncHandler } from '../asyncHandler';

/** Ruta de leaderboard: top de clasificación global por nivel. */
export function createLeaderboardRouter(container: AppContainer): Router {
  const router = Router();

  router.get(
    '/leaderboard/:levelId',
    asyncHandler(async (req, res) => {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const entries = await container.getLeaderboard.execute({ levelId: req.params.levelId, limit });
      res.status(200).json(entries);
    }),
  );

  return router;
}

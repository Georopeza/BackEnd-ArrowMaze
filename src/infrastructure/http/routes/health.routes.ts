import { Router } from 'express';

/**
 * Ruta de diagnóstico: confirma que el servidor está en pie.
 *
 * Es el primer endpoint del backend, usado como chequeo de CI/CD y como
 * verificación manual rápida (`GET /health`).
 */
export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

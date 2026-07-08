import { NextFunction, Request, Response } from 'express';

/**
 * Middleware transversal (aspecto AOP de logging).
 *
 * Registra método, ruta, código de estado y duración de cada petición,
 * sin que ningún caso de uso o controlador tenga que preocuparse de ello.
 */
export function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    // eslint-disable-next-line no-console
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
  });

  next();
}

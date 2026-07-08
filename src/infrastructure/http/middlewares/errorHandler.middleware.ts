import { NextFunction, Request, Response } from 'express';

/**
 * Middleware transversal (aspecto AOP de manejo centralizado de errores).
 *
 * Punto único donde se traduce cualquier excepción no controlada (de
 * dominio o inesperada) a una respuesta HTTP consistente, en vez de que
 * cada controlador tenga que repetir su propio try/catch.
 *
 * Debe registrarse al final de la cadena de middlewares/rutas de Express.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandlerMiddleware(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const message = err instanceof Error ? err.message : 'Unexpected error';

  // eslint-disable-next-line no-console
  console.error('[error]', message);

  res.status(500).json({
    error: {
      message,
    },
  });
}

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApplicationError } from '../../../application/errors';

/**
 * Middleware transversal (aspecto AOP de manejo centralizado de errores).
 *
 * Punto único donde se traduce cualquier excepción no controlada (de
 * dominio, de aplicación o inesperada) a una respuesta HTTP consistente,
 * en vez de que cada controlador tenga que repetir su propio try/catch.
 *
 * Si el error es un `ApplicationError` (lanzado por un caso de uso), usa el
 * `statusCode` que ya trae consigo — los casos de uso no conocen HTTP, pero
 * sí saben si algo es "no encontrado", "conflicto", etc. Un `ZodError` (body
 * de request inválido) se traduce a 400 con el detalle de qué campo falló.
 * Cualquier otro error (de dominio o inesperado) se trata como 500; el
 * mensaje real de la excepción se registra en el log del servidor pero solo
 * se envía al cliente fuera de producción (`NODE_ENV !== 'production'`), para
 * no filtrar detalles internos (p. ej. de la base de datos) en despliegues
 * reales.
 *
 * Debe registrarse al final de la cadena de middlewares/rutas de Express.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandlerMiddleware(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const message = err instanceof Error ? err.message : 'Unexpected error';

  // eslint-disable-next-line no-console
  console.error('[error]', message);

  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({ error: { message: err.message } });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: { message: 'Invalid request body', details: err.issues } });
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  res.status(500).json({
    error: {
      message: isProduction ? 'Internal server error' : message,
    },
  });
}

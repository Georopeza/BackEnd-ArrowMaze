import { Request, Response } from 'express';

/**
 * Captura cualquier ruta no reconocida por los routers registrados.
 *
 * Sin este middleware, una petición a una ruta inexistente cae en el
 * manejador 404 por defecto de Express (HTML/texto plano), rompiendo la
 * consistencia del formato `{ error: { message } }` que usa el resto de la
 * API para todas las demás respuestas de error.
 *
 * Debe registrarse después de todos los routers y antes de
 * `errorHandlerMiddleware`.
 */
export function notFoundMiddleware(req: Request, res: Response): void {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

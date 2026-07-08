import { NextFunction, Request, Response } from 'express';

type AsyncRouteHandler = (req: Request, res: Response) => Promise<void>;

/**
 * Envuelve un handler async de Express para que cualquier rechazo de
 * promesa (p. ej. un `ApplicationError` lanzado por un caso de uso) llegue
 * a `next(err)` y termine en `errorHandlerMiddleware`, en vez de quedar
 * como una unhandled rejection (Express 4 no hace esto automáticamente).
 */
export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res).catch(next);
  };
}

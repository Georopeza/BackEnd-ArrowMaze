import { NextFunction, Request, Response } from 'express';
import { ITokenService } from '../../../application/ports/ITokenService';
import { UnauthorizedError } from '../../../application/errors/UnauthorizedError';

/**
 * Extrae el token Bearer del header `Authorization`.
 *
 * Formato esperado: `Authorization: Bearer <jwt>`.
 * Retorna `null` si el header falta o no sigue el esquema Bearer.
 */
function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token?.trim()) {
    return null;
  }

  return token.trim();
}

/**
 * Factory del tercer aspecto transversal AOP: **autorización JWT**.
 *
 * Valida que la petición incluya un token emitido por `LoginUserUseCase`
 * (vía [ITokenService.verify]) y adjunta el payload en `req.auth` para
 * que los handlers downstream conozcan `userId` y `username` sin re-parsear.
 *
 * Rutas que deben protegerse: `POST /progress/sync`, `PUT /levels/:id`.
 * Rutas públicas (sin este middleware): `GET /levels`, registro/login, health.
 */
export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const rawToken = extractBearerToken(req.headers.authorization);
    if (!rawToken) {
      next(new UnauthorizedError('Missing or malformed Authorization header'));
      return;
    }

    const payload = tokenService.verify(rawToken);
    if (!payload) {
      next(new UnauthorizedError('Invalid or expired token'));
      return;
    }

    req.auth = payload;
    next();
  };
}

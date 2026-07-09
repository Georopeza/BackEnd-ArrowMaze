import { TokenPayload } from '../../../application/ports/ITokenService';

/**
 * Extensión de tipos de Express para adjuntar el usuario autenticado
 * tras validar el JWT en `authMiddleware`.
 */
declare global {
  namespace Express {
    interface Request {
      /** Claims del token JWT verificado; `undefined` en rutas públicas. */
      auth?: TokenPayload;
    }
  }
}

export {};

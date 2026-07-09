import type { TokenPayload } from '../../../application/ports/ITokenService';

/**
 * Ampliación de tipos de Express para adjuntar el usuario autenticado
 * tras validar el JWT en `auth.middleware`.
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

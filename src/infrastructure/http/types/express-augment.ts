import type { TokenPayload } from '../../../application/ports/ITokenService';

/**
 * Ampliación de tipos de Express para adjuntar el usuario autenticado
 * tras validar el JWT en `auth.middleware`.
 */
declare global {
  // Augmentar el namespace `Express` es el único mecanismo soportado por
  // TypeScript para extender tipos de una librería de terceros como esta.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      /** Claims del token JWT verificado; `undefined` en rutas públicas. */
      auth?: TokenPayload;
    }
  }
}

export {};

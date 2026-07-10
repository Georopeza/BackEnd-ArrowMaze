import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '../../application/ports/ITokenService';

const DEFAULT_EXPIRES_IN = '2h';

/**
 * Implementación concreta de `ITokenService` usando `jsonwebtoken`.
 *
 * El secreto se inyecta por constructor (no se lee `process.env`
 * directamente aquí) para que la clase siga siendo testeable sin variables
 * de entorno globales; `src/infrastructure/http/server.ts` es quien decide
 * de dónde sale el secreto real.
 */
export class JwtTokenService implements ITokenService {
  /**
   * @param secret Clave de firma HMAC del JWT (inyectada desde configuración).
   * @param expiresIn Duración del token (formato aceptado por `jsonwebtoken`, p. ej. `2h`).
   */
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = DEFAULT_EXPIRES_IN,
  ) {}

  /**
   * Firma un JWT con los claims de sesión (`userId`, `username`).
   *
   * @param payload Claims mínimos acordados con el frontend.
   * @returns Token compacto serializado (header.payload.signature).
   */
  public generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  /**
   * Verifica la firma y expiración del token.
   *
   * @param token JWT recibido en `Authorization: Bearer`.
   * @returns Payload si es válido; `null` si expiró, la firma no coincide o el shape es inválido.
   */
  public verify(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.secret);
      if (typeof decoded === 'string' || !('userId' in decoded) || !('username' in decoded)) {
        return null;
      }
      return { userId: decoded.userId as string, username: decoded.username as string };
    } catch {
      return null;
    }
  }
}

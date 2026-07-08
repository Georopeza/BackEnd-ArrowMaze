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
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string = DEFAULT_EXPIRES_IN,
  ) {}

  public generate(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

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

import bcrypt from 'bcrypt';
import { IPasswordHasher } from '../../domain/services/IPasswordHasher';

const SALT_ROUNDS = 10;

/**
 * Implementación concreta de `IPasswordHasher` usando `bcrypt`.
 *
 * Vive en infraestructura porque el dominio (`User.verifyPassword`) solo
 * conoce la interfaz; esta clase es el único lugar del backend que sabe
 * qué librería de hashing se usa.
 */
export class BcryptPasswordHasher implements IPasswordHasher {
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

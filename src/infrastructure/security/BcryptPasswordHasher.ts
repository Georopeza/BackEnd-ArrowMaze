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
  /**
   * Genera un hash bcrypt de la contraseña en texto plano.
   *
   * @param password Contraseña sin hashear recibida en registro o cambio de clave.
   * @returns Hash seguro listo para persistir en la tabla `users`.
   */
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compara una contraseña en texto plano con un hash almacenado.
   *
   * @param password Contraseña ingresada por el usuario en login.
   * @param hash Valor persistido en `User.passwordHash`.
   * @returns `true` si coinciden; `false` en caso contrario.
   */
  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

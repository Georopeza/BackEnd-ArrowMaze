import { ApplicationError } from './ApplicationError';

/**
 * Error de aplicación: las credenciales de inicio de sesión no coinciden.
 *
 * Se lanza cuando el username no existe o la contraseña es incorrecta.
 * El mensaje es deliberadamente genérico para no revelar cuál campo falló.
 * El `errorHandler.middleware` lo traduce a HTTP 401.
 */
export class InvalidCredentialsError extends ApplicationError {
  public readonly statusCode = 401;

  constructor() {
    // Mensaje deliberadamente genérico: no revela si falló el username o el password.
    super('Invalid username or password');
  }
}

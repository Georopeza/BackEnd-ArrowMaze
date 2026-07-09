import { ApplicationError } from './ApplicationError';

/**
 * Error de aplicación: el cliente no presentó credenciales válidas.
 *
 * Se lanza desde el middleware de autorización JWT cuando falta el header
 * `Authorization`, el token está mal formado o la firma/expiración no es válida.
 * El `errorHandler.middleware` lo traduce a HTTP 401.
 */
export class UnauthorizedError extends ApplicationError {
  public readonly statusCode = 401;

  constructor(message = 'Authentication required') {
    super(message);
  }
}

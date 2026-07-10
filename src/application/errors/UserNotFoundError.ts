import { ApplicationError } from './ApplicationError';

/**
 * Error de aplicación: el usuario solicitado no existe en el repositorio.
 *
 * Se lanza cuando una operación referencia un `userId` inexistente.
 * El `errorHandler.middleware` lo traduce a HTTP 404.
 */
export class UserNotFoundError extends ApplicationError {
  public readonly statusCode = 404;

  constructor(userId: string) {
    super(`User "${userId}" was not found`);
  }
}

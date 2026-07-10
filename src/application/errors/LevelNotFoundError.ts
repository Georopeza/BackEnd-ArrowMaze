import { ApplicationError } from './ApplicationError';

/**
 * Error de aplicación: el nivel solicitado no existe en el catálogo.
 *
 * Se lanza cuando una operación referencia un `levelId` inexistente.
 * El `errorHandler.middleware` lo traduce a HTTP 404.
 */
export class LevelNotFoundError extends ApplicationError {
  public readonly statusCode = 404;

  constructor(levelId: string) {
    super(`Level "${levelId}" was not found`);
  }
}

import { ApplicationError } from './ApplicationError';

/**
 * Error de aplicación: la definición del nivel no es jugable.
 *
 * Se lanza cuando `LevelSolvabilityValidator` no encuentra un orden de
 * disparo válido que vacíe el tablero. El `errorHandler.middleware` lo
 * traduce a HTTP 422.
 */
export class LevelNotSolvableError extends ApplicationError {
  public readonly statusCode = 422;

  constructor(levelId: string) {
    super(`Level "${levelId}" has no valid firing order that clears the board`);
  }
}

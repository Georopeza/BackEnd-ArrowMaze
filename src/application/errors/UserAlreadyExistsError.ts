import { ApplicationError } from './ApplicationError';

/**
 * Error de aplicación: ya existe un usuario con el mismo username.
 *
 * Se lanza durante el registro cuando `IUserRepository.findByUsername`
 * devuelve un resultado. El `errorHandler.middleware` lo traduce a HTTP 409.
 */
export class UserAlreadyExistsError extends ApplicationError {
  public readonly statusCode = 409;

  constructor(username: string) {
    super(`A user with username "${username}" already exists`);
  }
}

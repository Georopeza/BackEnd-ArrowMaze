import { ApplicationError } from './ApplicationError';

export class InvalidCredentialsError extends ApplicationError {
  public readonly statusCode = 401;

  constructor() {
    // Mensaje deliberadamente genérico: no revela si falló el username o el password.
    super('Invalid username or password');
  }
}

import { ApplicationError } from './ApplicationError';

export class UserAlreadyExistsError extends ApplicationError {
  public readonly statusCode = 409;

  constructor(username: string) {
    super(`A user with username "${username}" already exists`);
  }
}

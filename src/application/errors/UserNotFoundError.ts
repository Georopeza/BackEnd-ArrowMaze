import { ApplicationError } from './ApplicationError';

export class UserNotFoundError extends ApplicationError {
  public readonly statusCode = 404;

  constructor(userId: string) {
    super(`User "${userId}" was not found`);
  }
}

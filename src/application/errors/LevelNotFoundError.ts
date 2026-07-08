import { ApplicationError } from './ApplicationError';

export class LevelNotFoundError extends ApplicationError {
  public readonly statusCode = 404;

  constructor(levelId: string) {
    super(`Level "${levelId}" was not found`);
  }
}

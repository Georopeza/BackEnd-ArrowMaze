import { ApplicationError } from './ApplicationError';

export class LevelNotSolvableError extends ApplicationError {
  public readonly statusCode = 422;

  constructor(levelId: string) {
    super(`Level "${levelId}" has no valid firing order that clears the board`);
  }
}

import { Request, Response } from 'express';
import { errorHandlerMiddleware } from '../../../src/infrastructure/http/middlewares/errorHandler.middleware';

function buildMockResponse(): Response {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('errorHandlerMiddleware — unexpected errors (500)', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should_expose_the_real_error_message_outside_production', () => {
    process.env.NODE_ENV = 'test';
    const res = buildMockResponse();
    const error = new Error('column "foo" does not exist');

    errorHandlerMiddleware(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'column "foo" does not exist' },
    });
  });

  it('should_hide_the_real_error_message_in_production', () => {
    process.env.NODE_ENV = 'production';
    const res = buildMockResponse();
    const error = new Error('column "foo" does not exist');

    errorHandlerMiddleware(error, {} as Request, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { message: 'Internal server error' },
    });
  });
});

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const Errors = {
  NotFound: (resource: string) =>
    new AppError('NOT_FOUND', `${resource} not found`, 404),

  BadRequest: (msg: string) =>
    new AppError('BAD_REQUEST', msg, 400),

  InvalidInput: (msg: string) =>
    new AppError('VALIDATION_ERROR', msg, 400),

  Unauthorized: () =>
    new AppError('UNAUTHORIZED', 'authentication required', 401),

  Forbidden: () =>
    new AppError('FORBIDDEN', 'insufficient permissions', 403),

  Internal: (msg = 'internal server error') =>
    new AppError('INTERNAL_ERROR', msg, 500),
} as const;

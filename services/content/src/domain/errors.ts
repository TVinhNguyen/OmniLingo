// ─── Domain Errors ─────────────────────────────────────────────────────────────

export class ContentError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'ContentError';
  }
}

export const Errors = {
  notFound: (resource: string, id: string) =>
    new ContentError('NOT_FOUND', `${resource} '${id}' not found`, 404),

  alreadyPublished: (id: string) =>
    new ContentError('ALREADY_PUBLISHED', `Lesson '${id}' is already published — create a new draft to edit`, 409),

  cannotEditPublished: (id: string) =>
    new ContentError('CANNOT_EDIT_PUBLISHED', `Cannot edit published lesson '${id}' — only drafts can be modified`, 409),

  versionConflict: (id: string) =>
    new ContentError('VERSION_CONFLICT', `Version conflict for '${id}'`, 409),

  unauthorized: () =>
    new ContentError('UNAUTHORIZED', 'Missing or invalid Authorization header', 401),

  forbidden: (action: string) =>
    new ContentError('FORBIDDEN', `Insufficient role to perform: ${action}`, 403),

  validationError: (msg: string) =>
    new ContentError('VALIDATION_ERROR', msg, 400),

  badRequest: (msg: string) =>
    new ContentError('BAD_REQUEST', msg, 400),
} as const;

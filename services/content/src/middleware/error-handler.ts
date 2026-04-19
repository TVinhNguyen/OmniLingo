import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ContentError } from '../domain/errors';

export function errorHandler(
  error: FastifyError | ContentError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  // Domain errors
  if (error instanceof ContentError) {
    reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });
    return;
  }

  // Zod validation errors (from fastify schema validation)
  const fastifyErr = error as FastifyError;
  if (fastifyErr.statusCode === 400 && fastifyErr.code === 'FST_ERR_VALIDATION') {
    reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: fastifyErr.message,
    });
    return;
  }

  // Mongoose validation errors
  if (error.name === 'ValidationError') {
    reply.status(400).send({
      error: 'VALIDATION_ERROR',
      message: error.message,
    });
    return;
  }

  // Mongoose duplicate key
  if ((error as any).code === 11000) {
    reply.status(409).send({
      error: 'CONFLICT',
      message: 'Resource already exists',
    });
    return;
  }

  // Generic Fastify errors
  if (fastifyErr.statusCode) {
    reply.status(fastifyErr.statusCode).send({
      error: 'REQUEST_ERROR',
      message: fastifyErr.message,
    });
    return;
  }

  // Unhandled — 500
  request.log.error({ err: error }, 'Unhandled error');
  reply.status(500).send({
    error: 'INTERNAL_ERROR',
    message: 'An internal error occurred',
  });
}

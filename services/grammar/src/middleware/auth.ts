import type { FastifyRequest, FastifyReply } from 'fastify';
import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { AppError } from '../domain/errors.js';

const jwksClient = jwksRsa({
  jwksUri: `${config.identityServiceUrl}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 60 * 60 * 1000, // 1 hour
  rateLimit: true,
});

interface JwtPayload {
  sub: string;
  roles?: string[];
  exp?: number;
}

/**
 * Verifies the Bearer JWT using JWKS from identity-service.
 * Attaches req.user = { userId, roles } on success.
 */
export async function jwtAuthHook(req: FastifyRequest, reply: FastifyReply): Promise<void> {
  const auth = req.headers['authorization'];
  if (!auth?.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'authentication required' });
  }
  const token = auth.slice(7);

  try {
    // Decode header to get kid
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'invalid token' });
    }

    const key = await jwksClient.getSigningKey(decoded.header.kid);
    const publicKey = key.getPublicKey();

    const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
    (req as FastifyRequest & { user: JwtPayload }).user = payload;
  } catch (err) {
    return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'invalid or expired token' });
  }
}

/**
 * Requires the authenticated user to have at least one of the specified roles.
 */
export function requireRole(...roles: string[]) {
  return async function roleHook(req: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = (req as FastifyRequest & { user?: JwtPayload }).user;
    if (!user) {
      return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'authentication required' });
    }
    const userRoles = user.roles ?? [];
    const hasRole = roles.some(r => userRoles.includes(r));
    if (!hasRole) {
      return reply.code(403).send({ error: 'FORBIDDEN', message: 'insufficient permissions' });
    }
  };
}

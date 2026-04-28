/**
 * Content-service auth plugin.
 * Wraps @omnilingo/auth-middleware jwtAuthPlugin and adds content-specific
 * role decorators (requireContentRole, requireContentAdmin).
 *
 * Replaces the old src/plugins/jwt-auth.ts.
 */
import fp from 'fastify-plugin';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import { jwtAuthPlugin } from '@omnilingo/auth-middleware';

const CONTENT_ROLES = ['content_editor', 'content_admin', 'platform_admin', 'admin'] as const;
const ADMIN_ROLES   = ['content_admin', 'platform_admin', 'admin'] as const;

const contentAuthPlugin: FastifyPluginAsync<{ identityServiceUrl: string }> = async (
  fastify,
  opts,
) => {
  // Register shared JWT auth — provides requireAuth + requireRole
  await fastify.register(jwtAuthPlugin, { identityServiceUrl: opts.identityServiceUrl });

  /**
   * requireContentRole — preHandler: user must have at least content_editor role.
   * Defined here (not in shared pkg) because it is domain-specific to content-service.
   */
  fastify.decorate(
    'requireContentRole',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const user = request.user;
      if (!user) {
        return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'authentication required' });
      }
      const hasRole = CONTENT_ROLES.some((r) => user.roles.includes(r));
      if (!hasRole) {
        return reply.code(403).send({ error: 'FORBIDDEN', message: 'content write operations require content_editor role or higher' });
      }
    },
  );

  /**
   * requireContentAdmin — preHandler: user must have content_admin role or higher.
   */
  fastify.decorate(
    'requireContentAdmin',
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const user = request.user;
      if (!user) {
        return reply.code(401).send({ error: 'UNAUTHORIZED', message: 'authentication required' });
      }
      const isAdmin = ADMIN_ROLES.some((r) => user.roles.includes(r));
      if (!isAdmin) {
        return reply.code(403).send({ error: 'FORBIDDEN', message: 'content admin operations require content_admin role or higher' });
      }
    },
  );
};

export default fp(contentAuthPlugin, { name: 'content-auth' });

declare module 'fastify' {
  interface FastifyInstance {
    requireContentRole: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireContentAdmin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

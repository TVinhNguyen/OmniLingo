import type { FastifyInstance } from 'fastify';
import mongoose from 'mongoose';

export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  // Liveness — process alive
  fastify.get('/healthz', async (_req, reply) => {
    return reply.send({
      status: 'ok',
      service: 'content-service',
      version: fastify.config.version,
    });
  });

  // Readiness — dependencies healthy
  fastify.get('/readyz', async (_req, reply) => {
    const checks: Record<string, string> = {};
    let ready = true;

    // MongoDB
    try {
      if (mongoose.connection.readyState !== 1) throw new Error('not connected');
      await mongoose.connection.db?.admin().ping();
      checks['mongodb'] = 'ok';
    } catch {
      checks['mongodb'] = 'error';
      ready = false;
    }

    // Redis
    try {
      const pong = await fastify.redis.ping();
      checks['redis'] = pong === 'PONG' ? 'ok' : 'degraded';
    } catch {
      checks['redis'] = 'degraded'; // Redis is non-critical
    }

    if (!ready) {
      return reply.status(503).send({ status: 'not_ready', checks });
    }
    return reply.send({ status: 'ready', checks });
  });
}

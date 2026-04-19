import fp from 'fastify-plugin';
import Redis from 'ioredis';
import type { FastifyPluginAsync } from 'fastify';

const redisPlugin: FastifyPluginAsync<{ url: string }> = async (fastify, opts) => {
  const redis = new Redis(opts.url, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 5000,
  });

  redis.on('error', (err) => {
    fastify.log.warn({ err }, 'Redis connection error (non-fatal)');
  });

  try {
    await redis.connect();
    fastify.log.info('Redis connected');
  } catch (err) {
    fastify.log.warn({ err }, 'Redis unavailable — caching disabled');
  }

  fastify.decorate('redis', redis);

  fastify.addHook('onClose', async () => {
    await redis.quit();
  });
};

export default fp(redisPlugin, { name: 'redis' });

declare module 'fastify' {
  interface FastifyInstance {
    redis: Redis;
  }
}

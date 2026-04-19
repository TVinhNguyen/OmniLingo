import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import type { FastifyPluginAsync } from 'fastify';

const mongoPlugin: FastifyPluginAsync<{ url: string }> = async (fastify, opts) => {
  await mongoose.connect(opts.url, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  fastify.log.info('MongoDB connected');

  fastify.addHook('onClose', async () => {
    await mongoose.disconnect();
    fastify.log.info('MongoDB disconnected');
  });

  // Expose mongoose for health checks
  fastify.decorate('mongoose', mongoose);
};

export default fp(mongoPlugin, { name: 'mongodb' });

// Augment Fastify instance
declare module 'fastify' {
  interface FastifyInstance {
    mongoose: typeof mongoose;
  }
}

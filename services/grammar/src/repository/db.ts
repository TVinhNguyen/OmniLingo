import mongoose from 'mongoose';
import Redis from 'ioredis';

// ─── MongoDB ──────────────────────────────────────────────────────────────────

export async function connectMongo(uri: string, logger?: { info(msg: string | object, ...rest: unknown[]): void; warn(msg: string | object, ...rest: unknown[]): void }): Promise<void> {
  await mongoose.connect(uri, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 10_000,
  });
  if (logger) {
    logger.info({ uri: uri.replace(/\/\/[^@]+@/, '//***@') }, 'mongodb connected');
  }
}

// ─── Redis (ioredis) ──────────────────────────────────────────────────────────

export async function connectRedis(url: string, logger?: { info(msg: string | object, ...rest: unknown[]): void; warn(msg: string | object, ...rest: unknown[]): void }): Promise<Redis | null> {
  try {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    await client.connect();
    await client.ping();
    if (logger) logger.info('redis connected');
    return client;
  } catch (err) {
    if (logger) {
      logger.warn({ err: (err as Error).message }, 'redis unavailable — caching disabled');
    }
    return null;
  }
}

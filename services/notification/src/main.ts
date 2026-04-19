import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pino } from 'pino';
import { Redis } from 'ioredis';
import { loadConfig } from './config/config';
import { Notifier } from './services/notifier';
import { NotificationConsumer } from './services/consumer';
import { notificationRoutes } from './routes/notifications';
import { verifyJWT } from './services/jwt';
import { collectDefaultMetrics, Registry, Counter } from 'prom-client';

async function main() {
  const cfg = loadConfig();
  const logger = pino({ level: cfg.env === 'production' ? 'info' : 'debug' });
  logger.info({ port: cfg.port, env: cfg.env }, 'starting notification-service');

  // Redis
  const redis = new Redis(cfg.redisUrl);
  redis.on('error', (e) => logger.error({ err: e }, 'Redis error'));

  // Prometheus
  const registry = new Registry();
  collectDefaultMetrics({ register: registry });
  const httpCounter = new Counter({
    name: 'notification_http_requests_total',
    help: 'HTTP requests',
    labelNames: ['method', 'route', 'status'],
    registers: [registry],
  });
  const dispatchCounter = new Counter({
    name: 'notification_dispatched_total',
    help: 'Notifications dispatched',
    labelNames: ['channel'],
    registers: [registry],
  });
  void dispatchCounter; // available via module-level if needed

  // Notifier
  const notifier = new Notifier(cfg, redis, logger.child({ module: 'notifier' }));

  // Fastify
  const app = Fastify({
    logger: false,
    requestIdHeader: 'x-request-id',
    bodyLimit: 65536, // 64 KB — prevents request body overflow attacks
  });
  await app.register(cors, {
    origin: cfg.allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['X-Request-ID', 'Retry-After'],
    maxAge: 3600,
  });

  // JWT RS256 Verification via JWKS (identity-service/.well-known/jwks.json)
  // Replaces the previous base64-decode-only stub — now cryptographically verified.
  const jwksUrl = `${cfg.identityServiceUrl}/.well-known/jwks.json`;
  app.addHook('onRequest', async (req, reply) => {
    const skip = ['/healthz', '/readyz', '/metrics'].some((p) => req.url.startsWith(p));
    if (skip) return;
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'UNAUTHORIZED', message: 'authentication required' });
    }
    try {
      const token = auth.slice(7);
      const claims = await verifyJWT(token, jwksUrl);
      (req as any).userId = claims.sub;
      (req as any).roles = claims.roles ?? [];
    } catch {
      return reply.status(401).send({ error: 'UNAUTHORIZED', message: 'invalid or expired token' });
    }
  });

  // Prometheus middleware
  app.addHook('onResponse', (req, reply, done) => {
    httpCounter.inc({ method: req.method, route: req.routerPath ?? req.url, status: String(reply.statusCode) });
    done();
  });

  // Health
  app.get('/healthz', async () => ({ ok: true, service: 'notification-service', version: cfg.version }));
  app.get('/readyz', async () => {
    const redisPing = await redis.ping().catch(() => null);
    const ok = redisPing === 'PONG';
    return { ready: ok, checks: { redis: ok ? 'ok' : 'error' } };
  });
  app.get('/metrics', async (_req, reply) => {
    reply.header('Content-Type', registry.contentType);
    return reply.send(await registry.metrics());
  });

  // API routes
  await app.register(
    async (sub) => { await sub.register(notificationRoutes, { notifier, redis }); },
    { prefix: '/api/v1/notifications' }
  );

  await app.listen({ port: cfg.port, host: '0.0.0.0' });
  logger.info({ port: cfg.port }, 'notification-service listening');

  // Kafka consumer (optional)
  let consumer: NotificationConsumer | null = null;
  if (cfg.kafkaEnabled) {
    consumer = new NotificationConsumer(cfg.kafkaBrokers, cfg.kafkaGroupId, notifier, logger.child({ module: 'consumer' }), redis);
    await consumer.start();
  }

  // Graceful shutdown
  const shutdown = async () => {
    logger.info('shutting down notification-service');
    await app.close();
    if (consumer) await consumer.stop();
    redis.disconnect();
    process.exit(0);
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error('Fatal error', err);
  process.exit(1);
});

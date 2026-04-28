import Fastify from 'fastify';
import cors from '@fastify/cors';
import { pino } from 'pino';
import { Redis } from 'ioredis';
import { loadConfig } from './config/config';
import { Notifier } from './services/notifier';
import { NotificationConsumer } from './services/consumer';
import { notificationRoutes } from './routes/notifications';
import { verifyToken, extractBearer } from '@omnilingo/auth-middleware';
import { collectDefaultMetrics, Registry, Counter, Histogram } from 'prom-client';

const SERVICE_NAME = 'notification';
const HTTP_DURATION_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];

async function main() {
  const cfg = loadConfig();
  const logger = pino({ level: cfg.env === 'production' ? 'info' : 'debug' });
  logger.info({ port: cfg.port, env: cfg.env }, 'starting notification-service');

  // Redis
  const redis = new Redis(cfg.redisUrl);
  redis.on('error', (e) => logger.error({ err: e }, 'Redis error'));

  // Prometheus
  const registry = new Registry();
  registry.setDefaultLabels({ service_name: SERVICE_NAME });
  collectDefaultMetrics({ register: registry });
  const httpCounter = new Counter({
    name: 'notification_http_requests_total',
    help: 'HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
    registers: [registry],
  });
  const httpDuration = new Histogram({
    name: 'notification_http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: HTTP_DURATION_BUCKETS,
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
  // Uses @omnilingo/auth-middleware — shared across all Node-TS services.
  app.addHook('onRequest', async (req, reply) => {
    const skip = ['/healthz', '/readyz', '/metrics'].some((p) => req.url.startsWith(p));
    if (skip) return;
    const token = extractBearer(req.headers.authorization);
    if (!token) {
      return reply.status(401).send({ error: 'UNAUTHORIZED', message: 'authentication required' });
    }
    try {
      const user = await verifyToken(token, cfg.identityServiceUrl);
      (req as any).userId = user.userId;
      (req as any).roles = user.roles;
    } catch {
      return reply.status(401).send({ error: 'UNAUTHORIZED', message: 'invalid or expired token' });
    }
  });

  // Prometheus middleware
  app.addHook('onRequest', (req, _reply, done) => {
    (req as unknown as { metricsStart: bigint }).metricsStart = process.hrtime.bigint();
    done();
  });

  app.addHook('onResponse', (req, reply, done) => {
    const route = req.routeOptions.url ?? req.url.split('?')[0];
    const statusCode = String(reply.statusCode);
    const start = (req as unknown as { metricsStart?: bigint }).metricsStart;
    const durationSec = start ? Number(process.hrtime.bigint() - start) / 1_000_000_000 : 0;

    httpCounter.inc({ method: req.method, route, status_code: statusCode });
    httpDuration.observe({ method: req.method, route, status_code: statusCode }, durationSec);
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

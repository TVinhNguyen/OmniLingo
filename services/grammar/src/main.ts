import Fastify, { type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { config } from './config.js';
import { connectMongo, connectRedis } from './repository/db.js';
import { GrammarPointRepository, DrillTemplateRepository, SlotPoolRepository } from './repository/grammar.repository.js';
import { GrammarService } from './service/grammar.service.js';
import { buildGrammarRoutes } from './handler/grammar.handler.js';
import { jwtAuthHook, requireRole } from './middleware/auth.js';
import { getMetrics, grammarMetrics } from './metrics/metrics.js';
import { AppError } from './domain/errors.js';
import { GrammarProducer } from './messaging/producer.js';

async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.env === 'production'
      ? { level: config.logLevel }
      : { level: config.logLevel, transport: { target: 'pino-pretty' } },
    requestTimeout: 15_000,
    bodyLimit: 64 * 1024, // 64KB
    genReqId: () => crypto.randomUUID(),
  });

  // ─── CORS ───────────────────────────────────────────────────────────────────
  await app.register(cors, {
    origin: config.allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'Retry-After'],
    maxAge: 3600,
  });

  // ─── Request-ID ─────────────────────────────────────────────────────────────
  app.addHook('onRequest', async (req, reply) => {
    const rid = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    reply.header('X-Request-ID', rid);
    // Store timer start for histogram
    (req as unknown as { _startTime: number })._startTime = Date.now();
  });

  // ─── Request duration metrics (counter + histogram) ──────────────────────
  app.addHook('onResponse', async (req, reply) => {
    const route = req.routerPath ?? req.url;
    const durationSec = ((req as unknown as { _startTime?: number })._startTime
      ? (Date.now() - (req as unknown as { _startTime: number })._startTime) / 1000
      : 0);

    grammarMetrics.httpRequestsTotal.inc({
      method: req.method,
      route,
      status_code: String(reply.statusCode),
    });

    grammarMetrics.httpRequestDuration.observe(
      { method: req.method, route },
      durationSec,
    );
  });

  // ─── Global error handler ──────────────────────────────────────────────────
  app.setErrorHandler((error, req, reply) => {
    if (error instanceof AppError) {
      return reply.code(error.statusCode).send({ error: error.code, message: error.message });
    }
    // Body too large
    if (error.statusCode === 413 || (error as { code?: string }).code === 'FST_ERR_CTP_BODY_TOO_LARGE') {
      return reply.code(413).send({ error: 'PAYLOAD_TOO_LARGE', message: 'request body too large' });
    }
    // Fastify validation error
    if (error.validation) {
      return reply.code(400).send({ error: 'BAD_REQUEST', message: error.message });
    }
    req.log.error({ err: error }, 'unhandled error');
    return reply.code(500).send({ error: 'INTERNAL_ERROR', message: 'internal server error' });
  });

  return app;
}

async function main() {
  const app = await buildApp();
  const logger = app.log;

  // ─── Infrastructure ──────────────────────────────────────────────────────
  await connectMongo(config.mongoUri, logger);
  const redis = await connectRedis(config.redisUrl, logger);

  // ─── Kafka Producer (optional) ────────────────────────────────────────────
  let producer: GrammarProducer | undefined;
  if (config.kafkaEnabled) {
    producer = new GrammarProducer(config.kafkaBrokers, logger);
    await producer.connect();
    logger.info('grammar kafka producer connected');
  }

  // ─── Dependencies ────────────────────────────────────────────────────────
  const pointRepo  = new GrammarPointRepository(redis as never);
  const drillRepo  = new DrillTemplateRepository();
  const poolRepo   = new SlotPoolRepository();
  const grammarSvc = new GrammarService(pointRepo, drillRepo, poolRepo, producer);
  const handlers   = buildGrammarRoutes(grammarSvc);

  // ─── Routes ──────────────────────────────────────────────────────────────

  // Health & readiness
  app.get('/healthz', async () => ({
    ok: true,
    service: 'grammar-service',
    version: config.version,
  }));

  app.get('/readyz', async (req, reply) => {
    const mongoOk = ['connected'].includes(
      (await import('mongoose')).default.connection.readyState === 1 ? 'connected' : 'disconnected',
    );
    const status = mongoOk ? 200 : 503;
    return reply.code(status).send({
      ready: mongoOk,
      checks: { mongodb: mongoOk ? 'ok' : 'error' },
    });
  });

  app.get('/metrics', async (req, reply) => {
    const body = await getMetrics();
    return reply.header('Content-Type', 'text/plain; version=0.0.4').send(body);
  });

  // ─── Public routes (no auth) ──────────────────────────────────────────────
  app.get('/api/v1/grammar/points', handlers.listPoints);
  app.get('/api/v1/grammar/points/:idOrSlug', handlers.getPoint);
  app.get('/api/v1/grammar/points/:id/drills', handlers.getDrills);
  app.get('/api/v1/grammar/points/:id/templates', handlers.getTemplates);

  // ─── Admin routes (content_editor+) ──────────────────────────────────────
  app.post('/api/v1/grammar/admin/points', {
    preHandler: [jwtAuthHook, requireRole('content_editor', 'content_admin', 'admin')],
    handler: handlers.createPoint,
  });
  app.patch('/api/v1/grammar/admin/points/:id', {
    preHandler: [jwtAuthHook, requireRole('content_editor', 'content_admin', 'admin')],
    handler: handlers.updatePoint,
  });
  app.delete('/api/v1/grammar/admin/points/:id', {
    preHandler: [jwtAuthHook, requireRole('content_admin', 'admin')],
    handler: handlers.deletePoint,
  });
  app.post('/api/v1/grammar/admin/drills', {
    preHandler: [jwtAuthHook, requireRole('content_editor', 'content_admin', 'admin')],
    handler: handlers.createDrill,
  });

  // ─── Listen ───────────────────────────────────────────────────────────────
  const address = await app.listen({ port: config.port, host: '0.0.0.0' });
  logger.info({ address }, 'grammar-service listening');

  // ─── Graceful shutdown ────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'shutting down grammar-service');
    await app.close();
    if (producer) await producer.disconnect();
    const { default: mongoose } = await import('mongoose');
    await mongoose.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
}

main().catch(err => {
  // Bootstrap error: use console since logger isn't available
  process.stderr.write(`fatal startup error: ${String(err)}\n`);
  process.exit(1);
});

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import fp from 'fastify-plugin';
import { config } from './config/index';
import mongoPlugin from './plugins/mongodb';
import redisPlugin from './plugins/redis';
import jwtAuthPlugin from './plugins/jwt-auth';
import metricsPlugin from './plugins/metrics';
import { errorHandler } from './middleware/error-handler';
import { healthRoutes } from './routes/health';
import { languageRoutes } from './routes/v1/languages';
import { trackRoutes } from './routes/v1/tracks';
import { courseRoutes } from './routes/v1/courses';
import { unitRoutes } from './routes/v1/units';
import { lessonRoutes } from './routes/v1/lessons';
import { exerciseRoutes } from './routes/v1/exercises';
import { adminRoutes } from './routes/admin/seed';
import { cacheService } from './services/cache.service';
import { LessonService } from './services/lesson.service';
import { ExerciseService } from './services/exercise.service';
import { KafkaService } from './services/kafka.service';

export async function buildApp() {
  const fastify = Fastify({
    logger: {
      level: config.logLevel,
      ...(config.env === 'development' ? { transport: { target: 'pino-pretty' } } : {}),
    },
    bodyLimit: 64 * 1024,
    requestTimeout: 30_000,
  });

  fastify.decorate('config', config);

  // ─── Security ─────────────────────────────────────────────────────────────
  await fastify.register(helmet, { contentSecurityPolicy: false });
  await fastify.register(cors, {
    origin: (origin, cb) => {
      // Reject requests with no Origin header in production (null-origin attack prevention)
      if (!origin) {
        if (config.env !== 'production') return cb(null, true);
        return cb(new Error('CORS: missing origin'), false);
      }
      if (config.allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    exposedHeaders: ['X-Request-ID', 'Retry-After'],
    maxAge: 3600,
  });

  // ─── Infrastructure (all wrapped with fp so decorators leak to all scopes) ─
  await fastify.register(fp(mongoPlugin), { url: config.mongodbUrl });
  await fastify.register(fp(redisPlugin), { url: config.redisUrl });
  await fastify.register(fp(jwtAuthPlugin), { identityServiceUrl: config.identityServiceUrl });
  await fastify.register(fp(metricsPlugin));

  fastify.setErrorHandler(errorHandler);

  // ─── Services ─────────────────────────────────────────────────────────────
  // Build after plugins are ready — use addHook onReady to ensure mongo/redis up
  const cache = await cacheService(fastify.redis);
  const kafka = new KafkaService(config.kafkaBrokers, config.kafkaEnabled);
  if (config.kafkaEnabled) await kafka.connect();
  const lessonSvc = new LessonService(cache, kafka, config);
  const exerciseSvc = new ExerciseService(cache, config);

  fastify.addHook('onClose', async () => kafka.disconnect());

  // ─── Health (root level, no prefix) ───────────────────────────────────────
  await fastify.register(fp(healthRoutes));

  // ─── API v1 — PLAIN register (no fp wrapper) so prefix works correctly ────
  //
  // NOTE: requireAuth / requireContentRole decorators are available here because
  // jwtAuthPlugin was registered with fp() above (breaks encapsulation upward).
  //
  await fastify.register(async (api) => {
    // GET /api/v1/content/languages
    await api.register(
      (sub, _opts, done) => { languageRoutes(sub, { cache, cfg: config }).then(() => done()).catch(done); },
      { prefix: '/languages' },
    );
    // GET /api/v1/content/tracks
    await api.register(
      (sub, _opts, done) => { trackRoutes(sub, { cache, cfg: config }).then(() => done()).catch(done); },
      { prefix: '/tracks' },
    );
    // GET|POST /api/v1/content/courses
    await api.register(
      (sub, _opts, done) => { courseRoutes(sub, { cache, cfg: config }).then(() => done()).catch(done); },
      { prefix: '/courses' },
    );
    // GET|POST /api/v1/content/units
    await api.register(
      (sub, _opts, done) => { unitRoutes(sub, { cache, cfg: config }).then(() => done()).catch(done); },
      { prefix: '/units' },
    );
    // CRUD /api/v1/content/lessons
    await api.register(
      (sub, _opts, done) => { lessonRoutes(sub, { lessonService: lessonSvc }).then(() => done()).catch(done); },
      { prefix: '/lessons' },
    );
    // CRUD /api/v1/content/exercises
    await api.register(
      (sub, _opts, done) => { exerciseRoutes(sub, { exerciseService: exerciseSvc }).then(() => done()).catch(done); },
      { prefix: '/exercises' },
    );
  }, { prefix: '/api/v1/content' });

  // ─── Admin dev-only ────────────────────────────────────────────────────────
  await fastify.register(adminRoutes, { prefix: '/admin' });

  return fastify;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

async function start() {
  const app = await buildApp();

  const shutdown = async (signal: string) => {
    app.log.info(`${signal} received — shutting down`);
    await app.close();
    process.exit(0);
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    app.log.info({ port: config.port, env: config.env, version: config.version }, 'content-service started');
  } catch (err) {
    app.log.error(err, 'Failed to start');
    process.exit(1);
  }
}

start();

declare module 'fastify' {
  interface FastifyInstance {
    config: typeof config;
  }
}

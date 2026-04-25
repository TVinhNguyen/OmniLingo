import fp from 'fastify-plugin';
import {
  Registry,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';
import type { FastifyPluginAsync } from 'fastify';

const SERVICE_NAME = 'content';
const HTTP_DURATION_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];

export interface ContentMetrics {
  httpRequestsTotal: Counter;
  httpRequestDuration: Histogram;
  cacheHitsTotal: Counter;
  cacheMissesTotal: Counter;
  lessonsTotal: Gauge;
  exercisesTotal: Gauge;
  dbQueryDuration: Histogram;
}

const metricsPlugin: FastifyPluginAsync = async (fastify) => {
  const register = new Registry();
  register.setDefaultLabels({ service_name: SERVICE_NAME });
  collectDefaultMetrics({ register });

  const metrics: ContentMetrics = {
    httpRequestsTotal: new Counter({
      name: 'content_http_requests_total',
      help: 'Total HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [register],
    }),

    httpRequestDuration: new Histogram({
      name: 'content_http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: HTTP_DURATION_BUCKETS,
      registers: [register],
    }),

    cacheHitsTotal: new Counter({
      name: 'content_cache_hits_total',
      help: 'Cache hits',
      labelNames: ['resource_type'],
      registers: [register],
    }),

    cacheMissesTotal: new Counter({
      name: 'content_cache_misses_total',
      help: 'Cache misses',
      labelNames: ['resource_type'],
      registers: [register],
    }),

    lessonsTotal: new Gauge({
      name: 'content_lessons_total',
      help: 'Total lessons by language and status',
      labelNames: ['language', 'status'],
      registers: [register],
    }),

    exercisesTotal: new Gauge({
      name: 'content_exercises_total',
      help: 'Total exercises by language and type',
      labelNames: ['language', 'type'],
      registers: [register],
    }),

    dbQueryDuration: new Histogram({
      name: 'content_db_query_duration_seconds',
      help: 'MongoDB query duration',
      labelNames: ['operation', 'collection'],
      buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
      registers: [register],
    }),
  };

  fastify.decorate('metrics', metrics);
  fastify.decorate('metricsRegistry', register);

  fastify.addHook('onRequest', async (request) => {
    (request as unknown as { metricsStart: bigint }).metricsStart = process.hrtime.bigint();
  });

  // HTTP instrumentation: add to every response
  fastify.addHook('onResponse', async (request, reply) => {
    const route = request.routeOptions.url ?? request.url.split('?')[0];
    const statusCode = String(reply.statusCode);
    const start = (request as unknown as { metricsStart?: bigint }).metricsStart;
    const durationSec = start ? Number(process.hrtime.bigint() - start) / 1_000_000_000 : 0;

    metrics.httpRequestsTotal.inc({
      method: request.method,
      route,
      status_code: statusCode,
    });
    metrics.httpRequestDuration.observe({
      method: request.method,
      route,
      status_code: statusCode,
    }, durationSec);
  });

  // Metrics endpoint
  fastify.get('/metrics', async (_req, reply) => {
    reply.header('Content-Type', register.contentType);
    return register.metrics();
  });
};

export default fp(metricsPlugin, { name: 'metrics' });

declare module 'fastify' {
  interface FastifyInstance {
    metrics: ContentMetrics;
    metricsRegistry: Registry;
  }
}

import fp from 'fastify-plugin';
import {
  Registry,
  Counter,
  Histogram,
  Gauge,
  collectDefaultMetrics,
} from 'prom-client';
import type { FastifyPluginAsync } from 'fastify';

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
      labelNames: ['method', 'route'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
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

  // HTTP instrumentation: add to every response
  fastify.addHook('onResponse', async (request, reply) => {
    const route = request.routerPath ?? request.url.split('?')[0];
    metrics.httpRequestsTotal.inc({
      method: request.method,
      route,
      status_code: reply.statusCode,
    });
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

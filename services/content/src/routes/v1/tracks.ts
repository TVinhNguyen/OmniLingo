import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Track } from '../../domain/models/content.model';
import { Errors } from '../../domain/errors';
import type { CacheService } from '../../services/cache.service';
import type { Config } from '../../config/index';

const TracksQuerySchema = z.object({
  language: z.string().min(2).max(5),
});

export async function trackRoutes(
  fastify: FastifyInstance,
  opts: { cache: CacheService; cfg: Config },
): Promise<void> {
  const { cache, cfg } = opts;

  /**
   * GET /api/v1/content/tracks?language=ja
   */
  fastify.get<{ Querystring: { language?: string } }>('/', async (req, reply) => {
    const parsed = TracksQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw Errors.validationError('language query param is required (2-5 chars)');
    }
    const { language } = parsed.data;

    const cacheKey = cache.keys.tracks(language);
    const cached = await cache.get(cacheKey);
    if (cached) {
      fastify.metrics.cacheHitsTotal.inc({ resource_type: 'tracks' });
      return reply.send({ tracks: cached });
    }

    fastify.metrics.cacheMissesTotal.inc({ resource_type: 'tracks' });
    const tracks = await Track.find({ language, isActive: true })
      .sort({ order: 1 })
      .lean();

    await cache.set(cacheKey, tracks, cfg.cacheTtl.tracks);
    return reply.send({ tracks });
  });
}

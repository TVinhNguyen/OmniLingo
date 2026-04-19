import type { FastifyInstance } from 'fastify';
import { Language } from '../../domain/models/content.model';
import type { CacheService } from '../../services/cache.service';
import type { Config } from '../../config/index';

export async function languageRoutes(
  fastify: FastifyInstance,
  opts: { cache: CacheService; cfg: Config },
): Promise<void> {
  const { cache, cfg } = opts;

  /**
   * GET /api/v1/content/languages
   * List all active languages — public, heavy cache
   */
  fastify.get('/', async (_req, reply) => {
    const cacheKey = cache.keys.languages();
    const cached = await cache.get(cacheKey);
    if (cached) {
      fastify.metrics.cacheHitsTotal.inc({ resource_type: 'languages' });
      return reply.send({ languages: cached });
    }

    fastify.metrics.cacheMissesTotal.inc({ resource_type: 'languages' });
    const languages = await Language.find({ isActive: true })
      .sort({ code: 1 })
      .lean();

    await cache.set(cacheKey, languages, cfg.cacheTtl.languages);
    return reply.send({ languages });
  });
}

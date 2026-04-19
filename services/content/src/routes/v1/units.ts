import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Unit } from '../../domain/models/content.model';
import { Errors } from '../../domain/errors';
import type { CacheService } from '../../services/cache.service';
import type { Config } from '../../config/index';

const CreateUnitSchema = z.object({
  id: z.string().min(3),
  courseId: z.string().min(3),
  title: z.record(z.string()),
  description: z.record(z.string()).optional(),
  order: z.number().int().optional(),
});

export async function unitRoutes(
  fastify: FastifyInstance,
  opts: { cache: CacheService; cfg: Config },
): Promise<void> {
  const { cache, cfg } = opts;

  /** GET /api/v1/content/units/:id */
  fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const { id } = req.params;
    const cacheKey = cache.keys.unit(id);
    const cached = await cache.get(cacheKey);
    if (cached) {
      fastify.metrics.cacheHitsTotal.inc({ resource_type: 'units' });
      return reply.send({ unit: cached });
    }

    fastify.metrics.cacheMissesTotal.inc({ resource_type: 'units' });
    const unit = await Unit.findOne({ id }).lean();
    if (!unit) throw Errors.notFound('Unit', id);

    await cache.set(cacheKey, unit, cfg.cacheTtl.units);
    return reply.send({ unit });
  });

  /** POST /api/v1/content/units — content_admin only */
  fastify.post(
    '/',
    { preHandler: [fastify.requireAuth, fastify.requireContentAdmin] },
    async (req, reply) => {
      const parsed = CreateUnitSchema.safeParse(req.body);
      if (!parsed.success) {
        throw Errors.validationError(parsed.error.errors.map((e) => e.message).join('; '));
      }

      const user = req.user!;
      const unit = await Unit.create({
        ...parsed.data,
        description: parsed.data.description ?? {},
        order: parsed.data.order ?? 0,
        lessonIds: [],
        createdBy: user.id,
        updatedBy: user.id,
      });

      return reply.status(201).send({ unit });
    },
  );
}

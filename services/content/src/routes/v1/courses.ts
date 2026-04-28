import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Course } from '../../domain/models/content.model';
import { Errors } from '../../domain/errors';
import type { CacheService } from '../../services/cache.service';
import type { Config } from '../../config/index';

const CreateCourseSchema = z.object({
  id: z.string().min(3),
  trackId: z.string().min(3),
  language: z.string().min(2).max(5),
  level: z.string().min(1),
  title: z.record(z.string()),
  description: z.record(z.string()).optional(),
  thumbnailUrl: z.string().url().optional(),
  order: z.number().int().optional(),
});

export async function courseRoutes(
  fastify: FastifyInstance,
  opts: { cache: CacheService; cfg: Config },
): Promise<void> {
  const { cache, cfg } = opts;

  /** GET /api/v1/content/courses/:id */
  fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const { id } = req.params;
    const cacheKey = cache.keys.course(id);
    const cached = await cache.get(cacheKey);
    if (cached) {
      fastify.metrics.cacheHitsTotal.inc({ resource_type: 'courses' });
      return reply.send({ course: cached });
    }

    fastify.metrics.cacheMissesTotal.inc({ resource_type: 'courses' });
    const course = await Course.findOne({ id, status: 'published' }).lean();
    if (!course) throw Errors.notFound('Course', id);

    await cache.set(cacheKey, course, cfg.cacheTtl.courses);
    return reply.send({ course });
  });

  /** GET /api/v1/content/courses?trackId=:trackId */
  fastify.get<{ Querystring: { trackId?: string } }>('/', async (req, reply) => {
    const { trackId } = req.query;
    if (!trackId) throw Errors.badRequest('trackId query param is required');

    const cacheKey = `content:courses:track:${trackId}`;
    const cached = await cache.get<unknown[]>(cacheKey);
    if (cached) {
      fastify.metrics.cacheHitsTotal.inc({ resource_type: 'courses' });
      return reply.send({ courses: cached });
    }

    fastify.metrics.cacheMissesTotal.inc({ resource_type: 'courses' });
    const courses = await Course.find({ trackId, status: 'published' })
      .sort({ order: 1 })
      .lean();

    await cache.set(cacheKey, courses, cfg.cacheTtl.courses);
    return reply.send({ courses });
  });

  /** POST /api/v1/content/courses — content_admin only */
  fastify.post(
    '/',
    { preHandler: [fastify.requireAuth, fastify.requireContentAdmin] },
    async (req, reply) => {
      const parsed = CreateCourseSchema.safeParse(req.body);
      if (!parsed.success) {
        throw Errors.validationError(parsed.error.errors.map((e) => e.message).join('; '));
      }

      const user = req.user!;
      const course = await Course.create({
        ...parsed.data,
        description: parsed.data.description ?? {},
        order: parsed.data.order ?? 0,
        unitIds: [],
        status: 'draft',
        createdBy: user.userId,
        updatedBy: user.userId,
      });

      return reply.status(201).send({ course });
    },
  );
}

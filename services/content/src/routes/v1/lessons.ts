import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Errors } from '../../domain/errors';
import type { LessonService } from '../../services/lesson.service';

const CreateLessonSchema = z.object({
  language: z.string().min(2).max(5),
  track: z.string().min(1),
  level: z.string().min(1),
  unitId: z.string().min(3),
  title: z.record(z.string()),
  objective: z.record(z.string()).optional(),
  estimatedMinutes: z.number().int().min(1).max(120).optional(),
  blocks: z.array(z.any()).optional(),
  thumbnailUrl: z.string().url().optional(),
});

const UpdateLessonSchema = CreateLessonSchema.partial().omit({
  language: true, track: true, level: true, unitId: true,
});

export async function lessonRoutes(
  fastify: FastifyInstance,
  opts: { lessonService: LessonService },
): Promise<void> {
  const { lessonService } = opts;

  /** GET /api/v1/content/lessons/:id?version=N */
  fastify.get<{
    Params: { id: string };
    Querystring: { version?: string };
  }>('/:id', async (req, reply) => {
    const { id } = req.params;
    const version = req.query.version ? parseInt(req.query.version, 10) : undefined;
    const lesson = await lessonService.getById(id, version);
    return reply.send({ lesson });
  });

  /** GET /api/v1/content/lessons?unitId=:unitId */
  fastify.get<{ Querystring: { unitId?: string } }>('/', async (req, reply) => {
    const { unitId } = req.query;
    if (!unitId) throw Errors.badRequest('unitId query param is required');
    const lessons = await lessonService.getByUnit(unitId);
    return reply.send({ lessons });
  });

  /** POST /api/v1/content/lessons — content_editor+ */
  fastify.post(
    '/',
    { preHandler: [fastify.requireAuth, fastify.requireContentRole] },
    async (req, reply) => {
      const parsed = CreateLessonSchema.safeParse(req.body);
      if (!parsed.success) {
        throw Errors.validationError(parsed.error.errors.map((e) => e.message).join('; '));
      }
      const lesson = await lessonService.create(parsed.data, req.user!.id);
      return reply.status(201).send({ lesson });
    },
  );

  /** PATCH /api/v1/content/lessons/:id — content_editor+ */
  fastify.patch<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [fastify.requireAuth, fastify.requireContentRole] },
    async (req, reply) => {
      const parsed = UpdateLessonSchema.safeParse(req.body);
      if (!parsed.success) {
        throw Errors.validationError(parsed.error.errors.map((e) => e.message).join('; '));
      }
      const lesson = await lessonService.update(req.params.id, parsed.data, req.user!.id);
      return reply.send({ lesson });
    },
  );

  /** POST /api/v1/content/lessons/:id/publish — content_admin */
  fastify.post<{ Params: { id: string } }>(
    '/:id/publish',
    {
      preHandler: [fastify.requireAuth, fastify.requireContentAdmin],
      schema: { body: { type: ['object', 'null'], nullable: true } },
    },
    async (req, reply) => {
      const lesson = await lessonService.publish(req.params.id, req.user!.id);
      return reply.send({ lesson, message: `Lesson published at version ${lesson.version}` });
    },
  );

  /** DELETE /api/v1/content/lessons/:id — content_admin */
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [fastify.requireAuth, fastify.requireContentAdmin] },
    async (req, reply) => {
      await lessonService.archive(req.params.id, req.user!.id);
      return reply.status(204).send();
    },
  );
}

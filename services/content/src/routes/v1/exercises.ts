import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Errors } from '../../domain/errors';
import type { ExerciseService } from '../../services/exercise.service';

const CreateExerciseSchema = z.object({
  type: z.enum(['multiple_choice','dictation','speaking_prompt','fill_in_blank','sentence_arrange','matching','translation']),
  language: z.string().min(2).max(5),
  level: z.string().min(1),
  skill: z.enum(['vocabulary','grammar','listening','speaking','reading','writing']),
  prompt: z.object({
    text: z.record(z.string()).optional(),
    audioRef: z.string().optional(),
  }).optional(),
  choices: z.array(z.string()).optional(),
  answer: z.union([z.number(), z.string(), z.array(z.string())]).optional(),
  referenceText: z.string().optional(),
  lengthSeconds: z.number().optional(),
  durationSeconds: z.number().optional(),
  rubricCode: z.string().optional(),
  explanation: z.record(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().min(0).max(1).optional(),
});

export async function exerciseRoutes(
  fastify: FastifyInstance,
  opts: { exerciseService: ExerciseService },
): Promise<void> {
  const { exerciseService } = opts;

  /** GET /api/v1/content/exercises/:id */
  fastify.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const exercise = await exerciseService.getById(req.params.id);
    return reply.send({ exercise });
  });

  /**
   * GET /api/v1/content/exercises?ids=id1,id2,id3
   * Batch fetch — used by learning-service & assessment-service
   */
  fastify.get<{
    Querystring: { ids?: string; language?: string; skill?: string; level?: string; tags?: string; limit?: string };
  }>('/', async (req, reply) => {
    const { ids, language, skill, level, tags, limit } = req.query;

    if (ids) {
      const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
      if (idList.length > 100) throw Errors.badRequest('Max 100 ids per batch request');
      const exercises = await exerciseService.getBatch(idList);
      return reply.send({ exercises });
    }

    // Filtered list
    const exercises = await exerciseService.list({
      language,
      skill,
      level,
      tags: tags?.split(',').filter(Boolean),
      limit: limit ? parseInt(limit, 10) : 50,
    });
    return reply.send({ exercises, total: exercises.length });
  });

  /** POST /api/v1/content/exercises — content_editor+ */
  fastify.post(
    '/',
    { preHandler: [fastify.requireAuth, fastify.requireContentRole] },
    async (req, reply) => {
      const parsed = CreateExerciseSchema.safeParse(req.body);
      if (!parsed.success) {
        throw Errors.validationError(parsed.error.errors.map((e) => e.message).join('; '));
      }
      const exercise = await exerciseService.create(parsed.data, req.user!.userId);
      return reply.status(201).send({ exercise });
    },
  );

  /** PATCH /api/v1/content/exercises/:id — content_editor+ */
  fastify.patch<{ Params: { id: string } }>(
    '/:id',
    { preHandler: [fastify.requireAuth, fastify.requireContentRole] },
    async (req, reply) => {
      const parsed = CreateExerciseSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        throw Errors.validationError(parsed.error.errors.map((e) => e.message).join('; '));
      }
      const exercise = await exerciseService.update(req.params.id, parsed.data, req.user!.userId);
      return reply.send({ exercise });
    },
  );
}

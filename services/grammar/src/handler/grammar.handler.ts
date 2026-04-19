import type { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import type { GrammarService } from '../service/grammar.service.js';
import { AppError } from '../domain/errors.js';
import { grammarMetrics } from '../metrics/metrics.js';

// ─── Request schemas ──────────────────────────────────────────────────────────

const listQuerySchema = z.object({
  language: z.string().optional(),
  level:    z.string().optional(),
  tag:      z.string().optional(),
  search:   z.string().optional(),
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).default(20).transform(v => Math.min(v, 100)),
});

const drillQuerySchema = z.object({
  count: z.coerce.number().int().min(1).max(20).default(5),
});

const createPointSchema = z.object({
  language:    z.string().min(2),
  level:       z.string().min(1),
  title:       z.string().min(1),
  slug:        z.string().min(1).regex(/^[a-z0-9-]+$/),
  explanation: z.string().min(1),
  formation:   z.string().min(1),
  examples:    z.array(z.object({
    sentence:    z.string(),
    translation: z.string(),
    audio_url:   z.string().optional(),
  })).default([]),
  tags: z.array(z.string()).default([]),
});

// ─── Handlers ─────────────────────────────────────────────────────────────────

export function buildGrammarRoutes(svc: GrammarService) {
  return {
    // GET /api/v1/grammar/points?language=ja&level=N4
    listPoints: async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = listQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'BAD_REQUEST', message: parsed.error.message });
      }
      const result = await svc.listPoints(parsed.data);
      grammarMetrics.listTotal.inc({ language: parsed.data.language ?? 'all' });
      return reply.send({
        points: result.points,
        meta: { total: result.total, page: result.page, limit: result.limit },
      });
    },

    // GET /api/v1/grammar/points/:idOrSlug
    getPoint: async (req: FastifyRequest<{ Params: { idOrSlug: string } }>, reply: FastifyReply) => {
      const point = await svc.getPoint(req.params.idOrSlug);
      return reply.send({ point });
    },

    // POST /api/v1/grammar/admin/points (content_editor+)
    createPoint: async (req: FastifyRequest, reply: FastifyReply) => {
      const parsed = createPointSchema.safeParse(req.body);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'BAD_REQUEST', message: parsed.error.message });
      }
      const point = await svc.createPoint(parsed.data);
      return reply.code(201).send({ point });
    },

    // PATCH /api/v1/grammar/admin/points/:id
    updatePoint: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const point = await svc.updatePoint(req.params.id, req.body as Record<string, unknown>);
      return reply.send({ point });
    },

    // DELETE /api/v1/grammar/admin/points/:id
    deletePoint: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      await svc.deletePoint(req.params.id);
      return reply.code(204).send();
    },

    // GET /api/v1/grammar/points/:id/drills?count=5
    getDrills: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const parsed = drillQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send({ error: 'BAD_REQUEST', message: parsed.error.message });
      }
      const drills = await svc.generateDrills(req.params.id, parsed.data.count);
      grammarMetrics.drillsGenerated.inc(drills.length);
      return reply.send({ drills, count: drills.length });
    },

    // GET /api/v1/grammar/points/:id/templates (raw templates)
    getTemplates: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const templates = await svc.getDrillTemplates(req.params.id);
      return reply.send({ templates });
    },

    // POST /api/v1/grammar/admin/drills (add drill template)
    createDrill: async (req: FastifyRequest, reply: FastifyReply) => {
      const drill = await svc.createDrillTemplate(req.body as Record<string, unknown>);
      return reply.code(201).send({ drill });
    },
  };
}

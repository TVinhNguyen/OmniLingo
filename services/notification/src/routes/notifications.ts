import type { FastifyPluginAsync } from 'fastify';
import type { Notifier } from '../services/notifier';
import type { Redis } from 'ioredis';
import { z } from 'zod';

const SendSchema = z.object({
  userId: z.string().uuid(),
  channel: z.enum(['push', 'email', 'in_app', 'sms']),
  templateCode: z.string().min(1),
  variables: z.record(z.string()),
  email: z.string().email().optional(),
  deviceToken: z.string().optional(),
});

const PrefsSchema = z.object({
  pushEnabled: z.boolean().optional(),
  emailEnabled: z.boolean().optional(),
  streakReminders: z.boolean().optional(),
  lessonReminders: z.boolean().optional(),
  achievementAlerts: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
});

export const notificationRoutes: FastifyPluginAsync<{ notifier: Notifier; redis: Redis }> = async (app, { notifier, redis }) => {

  // GET /api/v1/notifications/inbox — in-app inbox for current user
  app.get('/inbox', async (req, reply) => {
    const userId = (req as any).userId;
    const key = `notif:inbox:${userId}`;
    const items = await redis.lrange(key, 0, 49);
    const parsed = items.map((i) => { try { return JSON.parse(i); } catch { return null; } }).filter(Boolean);
    return reply.send({ notifications: parsed, count: parsed.length });
  });

  // POST /api/v1/notifications/send — internal/admin: trigger a notification
  app.post('/send', async (req, reply) => {
    const body = SendSchema.safeParse(req.body);
    if (!body.success) return reply.status(400).send({ error: 'BAD_REQUEST', message: body.error.message });
    const result = await notifier.dispatch(body.data);
    return reply.send({ dispatched: result.sent, reason: result.reason });
  });

  // GET /api/v1/notifications/preferences
  app.get('/preferences', async (req, reply) => {
    const userId = (req as any).userId;
    const raw = await redis.get(`notif:prefs:${userId}`);
    const prefs = raw ? JSON.parse(raw) : defaultPrefs(userId);
    return reply.send({ preferences: prefs });
  });

  // PUT /api/v1/notifications/preferences
  app.put('/preferences', async (req, reply) => {
    const userId = (req as any).userId;
    const body = PrefsSchema.safeParse(req.body);
    if (!body.success) return reply.status(400).send({ error: 'BAD_REQUEST', message: body.error.message });
    const raw = await redis.get(`notif:prefs:${userId}`);
    const current = raw ? JSON.parse(raw) : defaultPrefs(userId);
    const merged = { ...current, ...body.data };
    await redis.set(`notif:prefs:${userId}`, JSON.stringify(merged), 'EX', 30 * 24 * 3600);
    return reply.send({ preferences: merged });
  });

  // DELETE /api/v1/notifications/inbox — clear inbox
  app.delete('/inbox', async (req, reply) => {
    const userId = (req as any).userId;
    await redis.del(`notif:inbox:${userId}`);
    return reply.send({ cleared: true });
  });
};

function defaultPrefs(userId: string) {
  return {
    userId, pushEnabled: true, emailEnabled: true, inAppEnabled: true,
    streakReminders: true, lessonReminders: true, achievementAlerts: true, marketingEmails: false,
  };
}



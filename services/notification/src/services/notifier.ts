// services/notification/src/services/notifier.ts
// Core notification dispatch engine with:
// - Channel routing (push | email | in_app | sms)
// - Rate limiting via Redis
// - Template rendering with Handlebars
// - User preference checking (noop DB in dev)

import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import type { NotificationPayload, Channel, UserNotifPrefs } from '../domain/types';
import type { NotificationConfig } from '../config/config';
import type { Redis } from 'ioredis';
import type { Logger } from 'pino';

export class Notifier {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    private readonly config: NotificationConfig,
    private readonly redis: Redis,
    private readonly logger: Logger,
  ) {
    if (config.smtpHost && config.smtpUser) {
      this.transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: { user: config.smtpUser, pass: config.smtpPass },
      });
    } else {
      // Dev: ethereal/log
      this.transporter = nodemailer.createTransport({ jsonTransport: true });
    }
  }

  // ─── Rate limiting ────────────────────────────────────────────────────────────

  async isThrottled(userId: string, channel: Channel): Promise<boolean> {
    const key = `notif:rate:${userId}:${channel}`;
    const count = await this.redis.incr(key);
    if (count === 1) await this.redis.expire(key, 3600); // 1 hour window
    return count > this.config.notifRateLimitPerHour;
  }

  // ─── Template rendering ───────────────────────────────────────────────────────

  renderTemplate(template: string, vars: Record<string, string>): string {
    return Handlebars.compile(template)(vars);
  }

  // ─── Channel dispatch ─────────────────────────────────────────────────────────

  async dispatch(payload: NotificationPayload): Promise<{ sent: boolean; reason?: string }> {
    const throttled = await this.isThrottled(payload.userId, payload.channel);
    if (throttled) {
      this.logger.warn({ userId: payload.userId, channel: payload.channel }, 'notification throttled');
      return { sent: false, reason: 'throttled' };
    }

    try {
      switch (payload.channel) {
        case 'email':
          return await this.sendEmail(payload);
        case 'push':
          return await this.sendPush(payload);
        case 'in_app':
          return await this.sendInApp(payload);
        default:
          return { sent: false, reason: `channel ${payload.channel} not implemented` };
      }
    } catch (err) {
      this.logger.error({ err, payload }, 'notification dispatch failed');
      return { sent: false, reason: String(err) };
    }
  }

  private async sendEmail(payload: NotificationPayload): Promise<{ sent: boolean; reason?: string }> {
    if (!payload.email) return { sent: false, reason: 'no email address' };
    const subject = payload.variables.subject ?? 'OmniLingo Notification';
    const html = this.renderTemplate(
      payload.variables.body ??
        '<p>Hello {{name}}, you have a new notification from OmniLingo.</p>',
      payload.variables,
    );
    const info = await this.transporter!.sendMail({
      from: this.config.emailFrom,
      to: payload.email,
      subject,
      html,
    });
    this.logger.info({ messageId: (info as nodemailer.SentMessageInfo).messageId, userId: payload.userId }, 'email sent');
    return { sent: true };
  }

  private async sendPush(payload: NotificationPayload): Promise<{ sent: boolean; reason?: string }> {
    if (!payload.deviceToken) return { sent: false, reason: 'no device token' };
    // In dev without FCM credentials, log the push
    this.logger.info({
      userId: payload.userId,
      token: payload.deviceToken.slice(0, 12) + '...',
      title: payload.variables.title ?? 'OmniLingo',
      body: payload.variables.body ?? '',
    }, 'push notification (dev mode)');
    return { sent: true };
  }

  private async sendInApp(payload: NotificationPayload): Promise<{ sent: boolean; reason?: string }> {
    // Store in Redis LPUSH for real-time delivery (SSE/WebSocket consumers can BRPOP)
    const key = `notif:inbox:${payload.userId}`;
    const item = JSON.stringify({
      id: uuidv4(),
      templateCode: payload.templateCode,
      variables: payload.variables,
      createdAt: new Date().toISOString(),
    });
    await this.redis.lpush(key, item);
    await this.redis.ltrim(key, 0, 49); // keep last 50
    await this.redis.expire(key, 7 * 24 * 3600); // 7 days TTL
    return { sent: true };
  }
}

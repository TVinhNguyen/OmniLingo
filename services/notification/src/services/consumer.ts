// Kafka consumer for notification-service with idempotency + DLQ retry
// Subscribes to: learning.streak.at_risk, srs.items.due,
//                gamification.achievement.unlocked, billing.trial.ending,
//                billing.subscription.created, identity.user.registered

import { Kafka, type Consumer, type EachMessagePayload, type Producer } from 'kafkajs';
import type { Redis } from 'ioredis';
import type { Notifier } from './notifier';
import type { KafkaEvent } from '../domain/types';
import { TEMPLATES } from '../domain/types';
import type { Logger } from 'pino';

const TOPICS = [
  'learning.streak.at_risk',
  'srs.items.due',
  'gamification.achievement.unlocked',
  'billing.trial.ending',
  'billing.subscription.created',
  'identity.user.registered',
];

const DLQ_TOPIC = 'notification.dlq';
const IDEMPOTENCY_TTL_S = 86400; // 24 hours
const MAX_RETRIES = 3;

export class NotificationConsumer {
  private consumer: Consumer;
  private dlqProducer: Producer;

  constructor(
    private readonly brokers: string[],
    private readonly groupId: string,
    private readonly notifier: Notifier,
    private readonly logger: Logger,
    private readonly redis?: Redis,
  ) {
    const kafka = new Kafka({ brokers, clientId: 'notification-service' });
    this.consumer = kafka.consumer({ groupId });
    this.dlqProducer = kafka.producer();
  }

  async start(): Promise<void> {
    await this.consumer.connect();
    await this.dlqProducer.connect();
    for (const topic of TOPICS) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
    }
    await this.consumer.run({ eachMessage: (m) => this.handle(m) });
    this.logger.info({ topics: TOPICS }, 'notification consumer started');
  }

  async stop(): Promise<void> {
    await this.consumer.disconnect();
    await this.dlqProducer.disconnect();
  }

  private async handle({ topic, message }: EachMessagePayload): Promise<void> {
    if (!message.value) return;
    let event: KafkaEvent;
    try {
      event = JSON.parse(message.value.toString()) as KafkaEvent;
    } catch {
      this.logger.warn({ topic }, 'invalid json in kafka message');
      return;
    }

    // Idempotency: skip if already processed
    const eventId = event.event_id;
    if (eventId && this.redis) {
      const key = `notif:event:${eventId}`;
      const exists = await this.redis.set(key, '1', 'EX', IDEMPOTENCY_TTL_S, 'NX');
      if (exists === null) {
        this.logger.debug({ topic, eventId }, 'duplicate event skipped');
        return;
      }
    }

    this.logger.debug({ topic, userId: event.user_id }, 'processing notification event');

    // Retry wrapper with DLQ
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await this.dispatch(topic, event);
        return;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        this.logger.warn({ topic, attempt, err: lastError.message }, 'dispatch attempt failed');
        if (attempt < MAX_RETRIES) {
          await sleep(attempt * 500);
        }
      }
    }

    // All retries exhausted → send to DLQ
    this.logger.error({ topic, userId: event.user_id }, 'sending to DLQ after all retries failed');
    await this.dlqProducer.send({
      topic: DLQ_TOPIC,
      messages: [{
        key: event.user_id,
        value: JSON.stringify({
          original_topic: topic,
          event,
          error: lastError?.message,
          failed_at: new Date().toISOString(),
        }),
      }],
    }).catch((e) => this.logger.error({ err: e }, 'DLQ publish failed'));
  }

  private async dispatch(topic: string, event: KafkaEvent): Promise<void> {
    switch (topic) {
      case 'learning.streak.at_risk':
        await this.notifier.dispatch({
          userId: event.user_id,
          channel: 'push',
          templateCode: TEMPLATES.STREAK_AT_RISK,
          variables: {
            title: '🔥 Don\'t break your streak!',
            body: `You haven't studied today. Keep your ${event.current_streak as string ?? '?'}-day streak alive!`,
          },
        });
        break;

      case 'srs.items.due':
        await this.notifier.dispatch({
          userId: event.user_id,
          channel: 'in_app',
          templateCode: TEMPLATES.SRS_DUE,
          variables: {
            title: '📚 Cards due for review',
            body: `You have ${event.due_count as string ?? '?'} vocabulary cards ready for review.`,
          },
        });
        break;

      case 'gamification.achievement.unlocked':
        await this.notifier.dispatch({
          userId: event.user_id,
          channel: 'in_app',
          templateCode: TEMPLATES.ACHIEVEMENT_UNLOCKED,
          variables: {
            title: `🏆 Achievement Unlocked!`,
            body: `You earned: ${event.achievement_name as string ?? 'a new badge'}`,
          },
        });
        break;

      case 'billing.trial.ending':
        await this.notifier.dispatch({
          userId: event.user_id,
          channel: 'email',
          templateCode: TEMPLATES.TRIAL_ENDING,
          email: event.email as string,
          variables: {
            subject: 'Your OmniLingo trial ends soon',
            body: '<p>Hi {{name}},<br>Your free trial ends in 3 days. Upgrade now to keep learning!</p>',
            name: event.display_name as string ?? 'learner',
          },
        });
        break;

      case 'billing.subscription.created':
        await this.notifier.dispatch({
          userId: event.user_id,
          channel: 'in_app',
          templateCode: TEMPLATES.SUBSCRIPTION_CONFIRMED,
          variables: {
            title: '✅ Subscription confirmed',
            body: `Welcome to ${event.plan_code as string ?? 'OmniLingo Plus'}! Your subscription is now active.`,
          },
        });
        break;

      case 'identity.user.registered':
        await this.notifier.dispatch({
          userId: event.user_id,
          channel: 'email',
          templateCode: TEMPLATES.WELCOME,
          email: event.email as string,
          variables: {
            subject: 'Welcome to OmniLingo! 🌸',
            body: '<h2>Welcome {{name}}!</h2><p>Your language learning journey starts now.</p>',
            name: event.display_name as string ?? 'there',
          },
        });
        break;

      default:
        this.logger.debug({ topic }, 'unhandled topic');
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

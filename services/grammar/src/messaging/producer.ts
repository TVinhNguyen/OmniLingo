/**
 * Grammar Kafka Producer
 * Publishes grammar.point.created and grammar.point.updated events.
 */
import { Kafka, type Producer, type RecordMetadata } from 'kafkajs';
import { randomUUID } from 'node:crypto';
import type { IGrammarPoint } from '../domain/models.js';

export interface GrammarEvent {
  event_id: string;
  event_type: 'grammar.point.created' | 'grammar.point.updated' | 'grammar.point.deleted';
  grammar_point_id: string;
  language: string;
  level: string;
  slug: string;
  occurred_at: string;
}

const TOPIC_CREATED = 'grammar.point.created';
const TOPIC_UPDATED = 'grammar.point.updated';

export class GrammarProducer {
  private producer: Producer;
  private connected = false;

  constructor(
    private readonly brokers: string[],
    private readonly logger: { info(msg: string | object, ...rest: unknown[]): void; warn(msg: string | object, ...rest: unknown[]): void; debug(msg: string | object, ...rest: unknown[]): void; error(msg: string | object, ...rest: unknown[]): void },
  ) {
    const kafka = new Kafka({ brokers, clientId: 'grammar-service' });
    this.producer = kafka.producer({
      retry: { retries: 3, initialRetryTime: 300 },
    });
  }

  async connect(): Promise<void> {
    await this.producer.connect();
    this.connected = true;
    this.logger.info({ brokers: this.brokers }, 'grammar kafka producer connected');
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await this.producer.disconnect();
      this.connected = false;
    }
  }

  async publishCreated(point: IGrammarPoint): Promise<void> {
    await this.send(TOPIC_CREATED, {
      event_id: randomUUID(),
      event_type: 'grammar.point.created',
      grammar_point_id: point._id?.toString() ?? '',
      language: point.language,
      level: point.level,
      slug: point.slug,
      occurred_at: new Date().toISOString(),
    });
  }

  async publishUpdated(point: IGrammarPoint): Promise<void> {
    await this.send(TOPIC_UPDATED, {
      event_id: randomUUID(),
      event_type: 'grammar.point.updated',
      grammar_point_id: point._id?.toString() ?? '',
      language: point.language,
      level: point.level,
      slug: point.slug,
      occurred_at: new Date().toISOString(),
    });
  }

  private async send(topic: string, event: GrammarEvent): Promise<void> {
    if (!this.connected) {
      this.logger.warn({ topic }, 'kafka producer not connected — skipping publish');
      return;
    }
    try {
      await this.producer.send({
        topic,
        messages: [{ key: event.grammar_point_id, value: JSON.stringify(event) }],
      });
      this.logger.debug({ topic, event_id: event.event_id }, 'grammar event published');
    } catch (err) {
      // Non-fatal: API should not fail if Kafka is unavailable
      this.logger.error({ topic, err }, 'grammar kafka publish failed');
    }
  }
}

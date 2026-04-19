import { Kafka, Producer, logLevel } from 'kafkajs';

interface KafkaEvent {
  eventId: string;
  [key: string]: unknown;
}

export class KafkaService {
  private producer: Producer | null = null;
  private readonly enabled: boolean;

  constructor(brokers: string[], enabled: boolean) {
    this.enabled = enabled;
    if (enabled) {
      const kafka = new Kafka({
        clientId: 'content-service',
        brokers,
        logLevel: logLevel.WARN,
      });
      this.producer = kafka.producer();
    }
  }

  async connect(): Promise<void> {
    if (this.producer) {
      await this.producer.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
    }
  }

  async publish(topic: string, event: KafkaEvent): Promise<void> {
    if (!this.enabled || !this.producer) return; // no-op in dev

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: event.eventId,
            value: JSON.stringify(event),
            headers: { 'content-type': 'application/json' },
          },
        ],
      });
    } catch (err) {
      // Fail-soft: log but do not throw — Kafka is not on critical path for reads
      console.warn('[kafka] publish failed:', err);
    }
  }
}

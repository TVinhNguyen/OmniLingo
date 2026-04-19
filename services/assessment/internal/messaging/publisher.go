package messaging

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)

// Publisher publishes events to Kafka topics.
type Publisher interface {
	Publish(ctx context.Context, topic string, payload []byte) error
	Close() error
}

// ─── Kafka Publisher ──────────────────────────────────────────────────────────

type kafkaPublisher struct {
	brokers []string
	writers map[string]*kafka.Writer
}

func NewKafkaPublisher(brokers []string) Publisher {
	return &kafkaPublisher{brokers: brokers, writers: make(map[string]*kafka.Writer)}
}

func (p *kafkaPublisher) writer(topic string) *kafka.Writer {
	if w, ok := p.writers[topic]; ok {
		return w
	}
	w := kafka.NewWriter(kafka.WriterConfig{
		Brokers:      p.brokers,
		Topic:        topic,
		Balancer:     &kafka.LeastBytes{},
		BatchTimeout: 10 * time.Millisecond,
	})
	p.writers[topic] = w
	return w
}

func (p *kafkaPublisher) Publish(ctx context.Context, topic string, payload []byte) error {
	return p.writer(topic).WriteMessages(ctx, kafka.Message{
		Key:   []byte(uuid.New().String()),
		Value: payload,
	})
}

func (p *kafkaPublisher) Close() error {
	for _, w := range p.writers {
		_ = w.Close()
	}
	return nil
}

// ─── No-op Publisher (dev mode) ───────────────────────────────────────────────

type noopPublisher struct{}

func NewNoopPublisher() Publisher { return &noopPublisher{} }

func (p *noopPublisher) Publish(_ context.Context, topic string, payload []byte) error {
	event := map[string]any{}
	_ = json.Unmarshal(payload, &event)
	return nil
}

func (p *noopPublisher) Close() error { return nil }

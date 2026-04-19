package messaging

import (
	"context"
	"encoding/json"

	kafka "github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// Publisher abstracts Kafka event publishing. Use noopPublisher when Kafka is disabled.
type Publisher interface {
	Publish(ctx context.Context, topic string, payload []byte) error
	Close() error
}

// kafkaPublisher wraps kafka-go writer.
type kafkaPublisher struct {
	writer *kafka.Writer
	log    *zap.Logger
}

// NewPublisher creates a real Kafka publisher.
func NewPublisher(brokers []string, log *zap.Logger) Publisher {
	w := &kafka.Writer{
		Addr:                   kafka.TCP(brokers...),
		Balancer:               &kafka.LeastBytes{},
		AllowAutoTopicCreation: true,
	}
	return &kafkaPublisher{writer: w, log: log}
}

func (p *kafkaPublisher) Publish(ctx context.Context, topic string, payload []byte) error {
	err := p.writer.WriteMessages(ctx, kafka.Message{
		Topic: topic,
		Value: payload,
	})
	if err != nil {
		p.log.Error("kafka publish failed", zap.String("topic", topic), zap.Error(err))
	}
	return err
}

func (p *kafkaPublisher) Close() error { return p.writer.Close() }

// noopPublisher is a no-op for development (KAFKA_ENABLED=false).
type noopPublisher struct{ log *zap.Logger }

// NewNoopPublisher returns a no-op publisher that logs but doesn't send.
func NewNoopPublisher(log *zap.Logger) Publisher {
	return &noopPublisher{log: log}
}

func (p *noopPublisher) Publish(_ context.Context, topic string, payload []byte) error {
	p.log.Debug("kafka disabled — skipping publish",
		zap.String("topic", topic),
		zap.Int("payload_bytes", len(payload)))
	return nil
}

func (p *noopPublisher) Close() error { return nil }

// MarshalAndPublish marshals event to JSON then publishes.
func MarshalAndPublish(ctx context.Context, pub Publisher, topic string, event any) error {
	payload, err := json.Marshal(event)
	if err != nil {
		return err
	}
	return pub.Publish(ctx, topic, payload)
}

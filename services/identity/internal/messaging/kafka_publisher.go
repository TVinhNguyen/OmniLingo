package messaging

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/twmb/franz-go/pkg/kgo"
	"go.uber.org/zap"
)

// Publisher sends domain events to Kafka.
type Publisher struct {
	client  *kgo.Client
	log     *zap.Logger
	enabled bool
}

// NewPublisher creates a new Kafka publisher.
// If enabled=false (dev mode), Publish is a no-op.
func NewPublisher(brokers []string, enabled bool, log *zap.Logger) (*Publisher, error) {
	if !enabled {
		return &Publisher{enabled: false, log: log}, nil
	}

	client, err := kgo.NewClient(
		kgo.SeedBrokers(brokers...),
	)
	if err != nil {
		return nil, fmt.Errorf("kafka: create client: %w", err)
	}

	return &Publisher{client: client, enabled: true, log: log}, nil
}

// Publish serializes the payload to JSON and sends it to the given topic.
// On failure, it logs the error but does not return it to the caller
// (fire-and-forget for non-critical events). Critical paths should use
// transactional outbox pattern instead.
func (p *Publisher) Publish(ctx context.Context, topic string, payload interface{}) {
	if !p.enabled {
		p.log.Debug("kafka disabled — skipping publish",
			zap.String("topic", topic))
		return
	}

	data, err := json.Marshal(payload)
	if err != nil {
		p.log.Error("kafka: marshal payload", zap.String("topic", topic), zap.Error(err))
		return
	}

	record := &kgo.Record{
		Topic: topic,
		Value: data,
	}

	if err := p.client.ProduceSync(ctx, record).FirstErr(); err != nil {
		p.log.Error("kafka: produce failed",
			zap.String("topic", topic),
			zap.Error(err))
		return
	}

	p.log.Debug("kafka: event published", zap.String("topic", topic))
}

// Close shuts down the Kafka client.
func (p *Publisher) Close() {
	if p.client != nil {
		p.client.Close()
	}
}

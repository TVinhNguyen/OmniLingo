package messaging

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/twmb/franz-go/pkg/kgo"
	"go.uber.org/zap"
)

// Publisher is the interface for publishing Kafka events.
type Publisher interface {
	Publish(ctx context.Context, topic string, payload any) error
	Close()
}

// kafkaPublisher sends events to Kafka using franz-go.
type kafkaPublisher struct {
	client *kgo.Client
	log    *zap.Logger
}

// noopPublisher silently discards events (used when KAFKA_ENABLED=false).
type noopPublisher struct{}

func (n *noopPublisher) Publish(_ context.Context, _ string, _ any) error { return nil }
func (n *noopPublisher) Close()                                            {}

// NewPublisher creates a Kafka publisher. If enabled=false, returns a no-op.
func NewPublisher(brokers []string, enabled bool, log *zap.Logger) (Publisher, error) {
	if !enabled {
		log.Info("Kafka disabled — using no-op publisher")
		return &noopPublisher{}, nil
	}

	client, err := kgo.NewClient(
		kgo.SeedBrokers(brokers...),
		kgo.AllowAutoTopicCreation(),
	)
	if err != nil {
		return nil, fmt.Errorf("kafka client: %w", err)
	}
	log.Info("Kafka publisher connected", zap.Strings("brokers", brokers))
	return &kafkaPublisher{client: client, log: log}, nil
}

func (p *kafkaPublisher) Publish(ctx context.Context, topic string, payload any) error {
	data, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal kafka payload: %w", err)
	}
	record := &kgo.Record{Topic: topic, Value: data}
	if err := p.client.ProduceSync(ctx, record).FirstErr(); err != nil {
		return fmt.Errorf("kafka produce: %w", err)
	}
	return nil
}

func (p *kafkaPublisher) Close() {
	p.client.Close()
}

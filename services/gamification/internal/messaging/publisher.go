package messaging

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
)

// ─── Outgoing event types ─────────────────────────────────────────────────────

type AchievementUnlockedEvent struct {
	EventID         string    `json:"event_id"`
	UserID          string    `json:"user_id"`
	AchievementCode string    `json:"achievement_code"`
	AchievementName string    `json:"achievement_name"`
	XPReward        int       `json:"xp_reward"`
	UnlockedAt      time.Time `json:"unlocked_at"`
}

type XPAwardedOutEvent struct {
	EventID  string    `json:"event_id"`
	UserID   string    `json:"user_id"`
	XP       int64     `json:"xp"`
	NewLevel int       `json:"new_level"`
	AwardedAt time.Time `json:"awarded_at"`
}

// Publisher publishes gamification events to Kafka.
type Publisher struct {
	writers map[string]*kafka.Writer
	log     *zap.Logger
}

func NewPublisher(brokers []string, log *zap.Logger) *Publisher {
	topics := []string{
		"gamification.achievement.unlocked",
		"gamification.xp.awarded",
		"gamification.streak.updated",
	}
	writers := make(map[string]*kafka.Writer, len(topics))
	for _, t := range topics {
		writers[t] = kafka.NewWriter(kafka.WriterConfig{
			Brokers:      brokers,
			Topic:        t,
			Balancer:     &kafka.LeastBytes{},
			BatchTimeout: 10 * time.Millisecond,
		})
	}
	return &Publisher{writers: writers, log: log}
}

func (p *Publisher) Close() {
	for _, w := range p.writers {
		_ = w.Close()
	}
}

func (p *Publisher) PublishAchievementUnlocked(ctx context.Context, userID uuid.UUID, code, name string, xpReward int) {
	event := AchievementUnlockedEvent{
		EventID:         uuid.New().String(),
		UserID:          userID.String(),
		AchievementCode: code,
		AchievementName: name,
		XPReward:        xpReward,
		UnlockedAt:      time.Now().UTC(),
	}
	p.publish(ctx, "gamification.achievement.unlocked", event)
}

func (p *Publisher) PublishXPAwarded(ctx context.Context, userID uuid.UUID, xp int64, newLevel int) {
	event := XPAwardedOutEvent{
		EventID:   uuid.New().String(),
		UserID:    userID.String(),
		XP:        xp,
		NewLevel:  newLevel,
		AwardedAt: time.Now().UTC(),
	}
	p.publish(ctx, "gamification.xp.awarded", event)
}

func (p *Publisher) publish(ctx context.Context, topic string, payload any) {
	data, err := json.Marshal(payload)
	if err != nil {
		p.log.Error("marshal event failed", zap.String("topic", topic), zap.Error(err))
		return
	}
	w, ok := p.writers[topic]
	if !ok {
		p.log.Error("unknown topic", zap.String("topic", topic))
		return
	}
	if err := w.WriteMessages(ctx, kafka.Message{
		Key:   []byte(uuid.New().String()),
		Value: data,
	}); err != nil {
		p.log.Warn("kafka publish failed", zap.String("topic", topic), zap.Error(err))
	}
}

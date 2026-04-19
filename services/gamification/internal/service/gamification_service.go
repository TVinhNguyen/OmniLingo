// Package service implements gamification business logic.
// Key features:
//   - XP accumulation with quadratic leveling curve
//   - Streak tracking (daily, freeze mechanic)
//   - Achievement unlocking with automatic checks
//   - Redis Sorted Set leaderboard (per league per week)
package service

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/omnilingo/gamification-service/internal/domain"
	"github.com/omnilingo/gamification-service/internal/repository"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
)

// XP rewards per event type
const (
	xpPerLessonCompleted = 30
	xpPerExercisePerfect = 10
	xpStreak7Bonus       = 50
	xpStreak30Bonus      = 200
	leagueKey            = "leaderboard:league:bronze:%s" // formatted with ISO week
)

// GamificationService manages XP, streaks, achievements, and leaderboard.
type GamificationService interface {
	GetProfile(ctx context.Context, userID uuid.UUID) (*domain.GamificationProfile, error)
	GetLeaderboard(ctx context.Context, leagueID string, limit int) ([]*domain.LeaderboardEntry, error)
	FreezeStreak(ctx context.Context, userID uuid.UUID) error
	ListAchievements(ctx context.Context) ([]*domain.Achievement, error)

	HandleLessonCompleted(ctx context.Context, event *domain.LessonCompletedEvent) error
	HandleExerciseGraded(ctx context.Context, event *domain.ExerciseGradedEvent) error
}

type gamificationService struct {
	xpRepo   repository.XPRepository
	strRepo  repository.StreakRepository
	achRepo  repository.AchievementRepository
	redis    *redis.Client
	log      *zap.Logger
}

func NewGamificationService(
	xpRepo repository.XPRepository,
	strRepo repository.StreakRepository,
	achRepo repository.AchievementRepository,
	rdb *redis.Client,
	log *zap.Logger,
) GamificationService {
	return &gamificationService{
		xpRepo: xpRepo, strRepo: strRepo, achRepo: achRepo, redis: rdb, log: log,
	}
}

// GetProfile returns full gamification state for a user.
func (s *gamificationService) GetProfile(ctx context.Context, userID uuid.UUID) (*domain.GamificationProfile, error) {
	xp, err := s.xpRepo.GetOrCreate(ctx, userID)
	if err != nil { return nil, domain.ErrInternalError }

	streak, err := s.strRepo.GetOrCreate(ctx, userID)
	if err != nil { return nil, domain.ErrInternalError }

	achievements, err := s.achRepo.ListByUser(ctx, userID)
	if err != nil { achievements = []*domain.UserAchievement{} }

	achList := make([]domain.UserAchievement, len(achievements))
	for i, a := range achievements { achList[i] = *a }

	return &domain.GamificationProfile{
		UserID: userID, XP: xp, Streak: streak, Achievements: achList,
	}, nil
}

// GetLeaderboard returns the Redis ZSET leaderboard for a league/week.
func (s *gamificationService) GetLeaderboard(ctx context.Context, leagueID string, limit int) ([]*domain.LeaderboardEntry, error) {
	if s.redis == nil {
		return []*domain.LeaderboardEntry{}, nil // Redis unavailable
	}
	if limit <= 0 || limit > 100 { limit = 50 }
	key := s.leaderboardKey(leagueID)

	entries, err := s.redis.ZRevRangeWithScores(ctx, key, 0, int64(limit-1)).Result()
	if err != nil {
		if err == redis.Nil { return []*domain.LeaderboardEntry{}, nil }
		return nil, domain.ErrInternalError
	}

	result := make([]*domain.LeaderboardEntry, len(entries))
	for i, e := range entries {
		result[i] = &domain.LeaderboardEntry{
			UserID: e.Member.(string), Score: e.Score, Rank: i + 1,
		}
	}
	return result, nil
}

// FreezeStreak uses a streak freeze for the user.
func (s *gamificationService) FreezeStreak(ctx context.Context, userID uuid.UUID) error {
	return s.strRepo.Freeze(ctx, userID)
}

// ListAchievements returns all available achievements.
func (s *gamificationService) ListAchievements(ctx context.Context) ([]*domain.Achievement, error) {
	return s.achRepo.ListAll(ctx)
}

// HandleLessonCompleted processes a learning.lesson.completed event.
func (s *gamificationService) HandleLessonCompleted(ctx context.Context, event *domain.LessonCompletedEvent) error {
	userID, err := uuid.Parse(event.UserID)
	if err != nil { return nil }

	xpEarned := int64(event.XPEarned)
	if xpEarned <= 0 { xpEarned = xpPerLessonCompleted }

	// 1. Add XP
	xp, err := s.xpRepo.AddXP(ctx, userID, xpEarned)
	if err != nil {
		s.log.Error("failed to add XP", zap.Error(err))
		return domain.ErrInternalError
	}

	// 2. Update streak
	today := time.Now().UTC().Format("2006-01-02")
	streak, err := s.strRepo.UpdateStreak(ctx, userID, today)
	if err != nil {
		s.log.Warn("failed to update streak", zap.Error(err))
	}

	// 3. Update leaderboard
	s.updateLeaderboard(ctx, userID, float64(xpEarned))

	// 4. Check streak milestones
	if streak != nil {
		if streak.Current == 7 { s.awardWithXP(ctx, userID, "streak_7", xpStreak7Bonus) }
		if streak.Current == 30 { s.awardWithXP(ctx, userID, "streak_30", xpStreak30Bonus) }
	}

	// 5. Check level milestone
	if xp.Level >= 10 { s.award(ctx, userID, "level_10") }
	if xp.Level >= 25 { s.award(ctx, userID, "level_25") }

	// 6. First lesson
	s.award(ctx, userID, "first_lesson")

	return nil
}

// HandleExerciseGraded processes assessment.exercise.graded event.
func (s *gamificationService) HandleExerciseGraded(ctx context.Context, event *domain.ExerciseGradedEvent) error {
	userID, err := uuid.Parse(event.UserID)
	if err != nil { return nil }

	// Perfect score bonus
	if event.MaxScore > 0 && event.Score == event.MaxScore {
		if _, err := s.xpRepo.AddXP(ctx, userID, xpPerExercisePerfect); err == nil {
			s.award(ctx, userID, "perfect_score")
			s.updateLeaderboard(ctx, userID, float64(xpPerExercisePerfect))
		}
	}
	return nil
}

// updateLeaderboard increments score in Redis ZSET for current league+week.
func (s *gamificationService) updateLeaderboard(ctx context.Context, userID uuid.UUID, delta float64) {
	if s.redis == nil {
		s.log.Debug("leaderboard update skipped: Redis unavailable")
		return
	}
	key := s.leaderboardKey("bronze") // default league
	if err := s.redis.ZIncrBy(ctx, key, delta, userID.String()).Err(); err != nil {
		s.log.Warn("leaderboard update failed", zap.Error(err))
	}
	// Set TTL on first write or refresh
	s.redis.Expire(ctx, key, 8*24*time.Hour)
}

func (s *gamificationService) leaderboardKey(leagueID string) string {
	year, week := time.Now().UTC().ISOWeek()
	return fmt.Sprintf("leaderboard:league:%s:%d-w%02d", leagueID, year, week)
}

func (s *gamificationService) award(ctx context.Context, userID uuid.UUID, code string) {
	if s.achRepo.HasAchievement(ctx, userID, code) { return }
	_ = s.achRepo.Award(ctx, userID, code)
}

func (s *gamificationService) awardWithXP(ctx context.Context, userID uuid.UUID, code string, xp int64) {
	if s.achRepo.HasAchievement(ctx, userID, code) { return }
	_ = s.achRepo.Award(ctx, userID, code)
	_, _ = s.xpRepo.AddXP(ctx, userID, xp)
}

// decodeEvent deserializes Kafka messages.
func decodeEvent[T any](data []byte) (T, error) {
	var v T
	return v, json.Unmarshal(data, &v)
}

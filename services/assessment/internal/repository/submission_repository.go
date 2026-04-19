package repository

import (
	"context"
	"encoding/json"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/omnilingo/assessment-service/internal/domain"
)

// ─── Submission Repository ────────────────────────────────────────────────────

type SubmissionRepository interface {
	Save(ctx context.Context, s *domain.Submission) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Submission, error)
	ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Submission, int, error)
}

type submissionRepo struct{ db *pgxpool.Pool }

func NewSubmissionRepository(db *pgxpool.Pool) SubmissionRepository {
	return &submissionRepo{db: db}
}

func (r *submissionRepo) Save(ctx context.Context, s *domain.Submission) error {
	answerJSON, _ := json.Marshal(s.Answer)
	var explanation, detail string
	if s.Result != nil {
		explanation = s.Result.Explanation
	}
	_ = detail

	_, err := r.db.Exec(ctx, `
		INSERT INTO submissions
			(id, user_id, exercise_id, exercise_type, answer, score, max_score, correct, skill_tag, language, explanation, submitted_at, graded_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
		ON CONFLICT (id) DO UPDATE SET
			score=EXCLUDED.score, max_score=EXCLUDED.max_score, correct=EXCLUDED.correct,
			explanation=EXCLUDED.explanation, graded_at=EXCLUDED.graded_at`,
		s.ID, s.UserID, s.ExerciseID, string(s.ExerciseType),
		answerJSON,
		func() *float64 {
			if s.Result != nil { v := s.Result.Score; return &v }
			return nil
		}(),
		func() *float64 {
			if s.Result != nil { v := s.Result.MaxScore; return &v }
			return nil
		}(),
		func() *bool {
			if s.Result != nil { v := s.Result.Correct; return &v }
			return nil
		}(),
		s.SkillTag, s.Language, explanation, s.SubmittedAt, s.GradedAt,
	)
	return err
}

func (r *submissionRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.Submission, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, exercise_id, exercise_type, answer, score, max_score, correct, skill_tag, language, explanation, submitted_at, graded_at
		FROM submissions WHERE id=$1`, id)

	s := &domain.Submission{}
	var answerRaw []byte
	var score, maxScore *float64
	var correct *bool
	var explanation, skillTag, language string
	var gradedAt *time.Time

	if err := row.Scan(&s.ID, &s.UserID, &s.ExerciseID, &s.ExerciseType,
		&answerRaw, &score, &maxScore, &correct, &skillTag, &language, &explanation, &s.SubmittedAt, &gradedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	_ = json.Unmarshal(answerRaw, &s.Answer)
	s.SkillTag = skillTag
	s.Language = language
	s.GradedAt = gradedAt
	if score != nil {
		s.Result = &domain.GradeResult{
			Score: *score, MaxScore: func() float64 {
				if maxScore != nil { return *maxScore }
				return 1.0
			}(), Correct: func() bool {
				if correct != nil { return *correct }
				return false
			}(), Explanation: explanation,
		}
	}
	return s, nil
}

func (r *submissionRepo) ListByUser(ctx context.Context, userID uuid.UUID, limit, offset int) ([]*domain.Submission, int, error) {
	var total int
	_ = r.db.QueryRow(ctx, `SELECT COUNT(*) FROM submissions WHERE user_id=$1`, userID).Scan(&total)

	rows, err := r.db.Query(ctx, `
		SELECT id, exercise_id, exercise_type, score, max_score, correct, skill_tag, language, submitted_at, graded_at
		FROM submissions WHERE user_id=$1 ORDER BY submitted_at DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var subs []*domain.Submission
	for rows.Next() {
		s := &domain.Submission{UserID: userID}
		var score, maxScore *float64
		var correct *bool
		var gradedAt *time.Time
		var skillTag, language string
		if err := rows.Scan(&s.ID, &s.ExerciseID, &s.ExerciseType, &score, &maxScore, &correct, &skillTag, &language, &s.SubmittedAt, &gradedAt); err != nil {
			continue
		}
		s.SkillTag = skillTag
		s.Language = language
		s.GradedAt = gradedAt
		if score != nil {
			s.Result = &domain.GradeResult{Score: *score, MaxScore: func() float64 {
				if maxScore != nil { return *maxScore }
				return 1.0
			}(), Correct: func() bool {
				if correct != nil { return *correct }
				return false
			}()}
		}
		subs = append(subs, s)
	}
	return subs, total, nil
}

// ─── Test Session Repository ──────────────────────────────────────────────────

type TestSessionRepository interface {
	Create(ctx context.Context, ts *domain.TestSession) error
	Update(ctx context.Context, ts *domain.TestSession) error
	FindByID(ctx context.Context, id uuid.UUID) (*domain.TestSession, error)
}

type testSessionRepo struct{ db *pgxpool.Pool }

func NewTestSessionRepository(db *pgxpool.Pool) TestSessionRepository {
	return &testSessionRepo{db: db}
}

func (r *testSessionRepo) Create(ctx context.Context, ts *domain.TestSession) error {
	_, err := r.db.Exec(ctx, `
		INSERT INTO test_sessions (id, user_id, test_id, status, started_at)
		VALUES ($1, $2, $3, $4, $5)`,
		ts.ID, ts.UserID, ts.TestID, string(ts.Status), ts.StartedAt)
	return err
}

func (r *testSessionRepo) Update(ctx context.Context, ts *domain.TestSession) error {
	answersJSON, _ := json.Marshal(ts.Answers)
	skillJSON, _ := json.Marshal(ts.SkillScores)
	_, err := r.db.Exec(ctx, `
		UPDATE test_sessions
		SET status=$1, answers=$2, total_score=$3, skill_scores=$4, completed_at=$5
		WHERE id=$6`,
		string(ts.Status), answersJSON, ts.TotalScore, skillJSON, ts.CompletedAt, ts.ID)
	return err
}

func (r *testSessionRepo) FindByID(ctx context.Context, id uuid.UUID) (*domain.TestSession, error) {
	row := r.db.QueryRow(ctx, `
		SELECT id, user_id, test_id, status, answers, total_score, skill_scores, started_at, completed_at
		FROM test_sessions WHERE id=$1`, id)

	ts := &domain.TestSession{}
	var answersRaw, skillRaw []byte
	var totalScore *float64
	if err := row.Scan(&ts.ID, &ts.UserID, &ts.TestID, &ts.Status,
		&answersRaw, &totalScore, &skillRaw, &ts.StartedAt, &ts.CompletedAt); err != nil {
		return nil, domain.ErrNotFound
	}
	_ = json.Unmarshal(answersRaw, &ts.Answers)
	_ = json.Unmarshal(skillRaw, &ts.SkillScores)
	ts.TotalScore = totalScore
	return ts, nil
}

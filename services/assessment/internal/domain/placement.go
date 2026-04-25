package domain

// ─── Placement Test ───────────────────────────────────────────────────────────

// PlacementQuestion is a single question in a CEFR placement test.
type PlacementQuestion struct {
	ID      string   `json:"id"`
	Prompt  string   `json:"prompt"`
	Choices []string `json:"choices"` // 4 options, index 0–3
	Skill   string   `json:"skill"`   // vocabulary | grammar | reading | listening
}

// PlacementTest is the full test sent to the client.
type PlacementTest struct {
	TestID     string              `json:"testId"`
	Lang       string              `json:"lang"`
	TargetLang string              `json:"targetLang"`
	Questions  []PlacementQuestion `json:"questions"`
	// answer key: question_id → correct choice index; NOT serialised to client
	AnswerKey  map[string]int      `json:"-"`
}

// PlacementAnswer is a single answer submitted by the user.
type PlacementAnswer struct {
	QuestionID string `json:"questionId"`
	Choice     int    `json:"choice"` // 0-indexed
}

// PlacementResult is returned after the user submits their answers.
type PlacementResult struct {
	CEFR               string  `json:"cefr"`               // A1 | A2 | B1 | B2 | C1 | C2
	Score              float64 `json:"score"`              // 0.0–1.0
	CorrectCount       int     `json:"correctCount"`
	TotalCount         int     `json:"totalCount"`
	RecommendedTrackID string  `json:"recommendedTrackId"` // slug for learning-service enrollment
}

// CEFRFromScore maps a correctness ratio (0.0–1.0) to a CEFR band.
// Thresholds tuned for a 12-question mixed-difficulty test.
func CEFRFromScore(ratio float64) string {
	switch {
	case ratio < 0.25:
		return "A1"
	case ratio < 0.40:
		return "A2"
	case ratio < 0.60:
		return "B1"
	case ratio < 0.75:
		return "B2"
	case ratio < 0.90:
		return "C1"
	default:
		return "C2"
	}
}

// TrackIDForCEFR returns a canonical track template ID for a given CEFR + target language.
func TrackIDForCEFR(cefr, targetLang string) string {
	// Convention: <targetLang>-<cefr-lowercase>-track
	// e.g. "vi-b1-track", "ja-a2-track", "en-c1-track"
	switch cefr {
	case "A1", "A2", "B1", "B2", "C1", "C2":
		return targetLang + "-" + lowercaseCEFR(cefr) + "-track"
	default:
		return targetLang + "-a1-track"
	}
}

func lowercaseCEFR(c string) string {
	m := map[string]string{"A1": "a1", "A2": "a2", "B1": "b1", "B2": "b2", "C1": "c1", "C2": "c2"}
	if v, ok := m[c]; ok { return v }
	return "a1"
}

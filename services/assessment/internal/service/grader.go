// Package grader implements the auto-grading engine for assessment-service.
// It handles multiple_choice, gap_fill, matching, and dictation exercise types.
// speaking_prompt and writing_prompt are delegated to AI services.
package service

import (
	"fmt"
	"strings"

	"github.com/omnilingo/assessment-service/internal/domain"
)

// Grade auto-grades an exercise submission.
// Returns a GradeResult — called synchronously for auto-gradable types.
// For speaking/writing, it returns a placeholder (async AI grading).
func Grade(exerciseType domain.ExerciseType, answer any, correctAnswer any, maxScore float64) *domain.GradeResult {
	switch exerciseType {
	case domain.ExerciseMultipleChoice:
		return gradeMultipleChoice(answer, correctAnswer, maxScore)
	case domain.ExerciseGapFill:
		return gradeGapFill(answer, correctAnswer, maxScore)
	case domain.ExerciseMatching:
		return gradeMatching(answer, correctAnswer, maxScore)
	case domain.ExerciseDictation:
		return gradeDictation(answer, correctAnswer, maxScore)
	case domain.ExerciseSpeaking, domain.ExerciseWriting:
		// Delegated to AI service — returns pending
		return &domain.GradeResult{Score: 0, MaxScore: maxScore, Correct: false, Explanation: "pending AI grading"}
	default:
		return &domain.GradeResult{Score: 0, MaxScore: maxScore, Correct: false, Explanation: "unknown exercise type"}
	}
}

// gradeMultipleChoice: answer = selected index (float64 when decoded from JSON), correct = index
func gradeMultipleChoice(answer, correct any, maxScore float64) *domain.GradeResult {
	aStr := normalizeToString(answer)
	cStr := normalizeToString(correct)
	isCorrect := aStr == cStr
	score := 0.0
	if isCorrect {
		score = maxScore
	}
	return &domain.GradeResult{Score: score, MaxScore: maxScore, Correct: isCorrect}
}

// gradeGapFill: answer = map[string]string{slotID → text}, correct = same map
func gradeGapFill(answer, correct any, maxScore float64) *domain.GradeResult {
	aMap := toStringMap(answer)
	cMap := toStringMap(correct)
	if len(cMap) == 0 {
		return &domain.GradeResult{Score: 0, MaxScore: maxScore, Correct: false, Explanation: "no answer key"}
	}
	correct_count := 0
	for k, cv := range cMap {
		av := aMap[k]
		if strings.EqualFold(strings.TrimSpace(av), strings.TrimSpace(cv)) {
			correct_count++
		}
	}
	score := (float64(correct_count) / float64(len(cMap))) * maxScore
	return &domain.GradeResult{
		Score: score, MaxScore: maxScore, Correct: correct_count == len(cMap),
		Detail: map[string]any{"correct_slots": correct_count, "total_slots": len(cMap)},
	}
}

// gradeMatching: answer = map[string]string{itemA → itemB}, correct = same
func gradeMatching(answer, correct any, maxScore float64) *domain.GradeResult {
	return gradeGapFill(answer, correct, maxScore) // same logic
}

// gradeDictation: answer = string transcript, correct = reference text
// Normalises case/punctuation, computes word-level accuracy.
func gradeDictation(answer, correct any, maxScore float64) *domain.GradeResult {
	aStr := normalizeText(normalizeToString(answer))
	cStr := normalizeText(normalizeToString(correct))
	if cStr == "" {
		return &domain.GradeResult{Score: 0, MaxScore: maxScore, Correct: false}
	}
	aWords := strings.Fields(aStr)
	cWords := strings.Fields(cStr)
	if len(cWords) == 0 {
		return &domain.GradeResult{Score: maxScore, MaxScore: maxScore, Correct: true}
	}
	matched := wordLevelMatch(aWords, cWords)
	score := (float64(matched) / float64(len(cWords))) * maxScore
	isCorrect := matched == len(cWords)
	return &domain.GradeResult{
		Score: score, MaxScore: maxScore, Correct: isCorrect,
		Detail: map[string]any{"matched_words": matched, "total_words": len(cWords), "accuracy": score / maxScore},
	}
}

// wordLevelMatch counts how many words in answer match reference (order-sensitive).
func wordLevelMatch(answer, reference []string) int {
	matched := 0
	ai := 0
	for _, rw := range reference {
		for ai < len(answer) {
			if strings.EqualFold(answer[ai], rw) {
				matched++
				ai++
				break
			}
			ai++
		}
	}
	return matched
}

func normalizeToString(v any) string {
	if v == nil {
		return ""
	}
	switch x := v.(type) {
	case string:
		return x
	case float64:
		return strings.TrimRight(strings.TrimRight(strings.TrimRight(
			strings.TrimRight(strings.TrimRight(strings.TrimRight(
				strings.TrimRight(strings.TrimRight(
					strings.TrimRight(
						strings.TrimRight(strings.TrimRight(fmt.Sprintf("%g", x), "0"), "."),
					"e"),
				"0"), "+"), "-"), "0"), "+"), "-"), "0"), ".")
	default:
		return fmt.Sprintf("%v", v)
	}
}

func normalizeText(s string) string {
	// Remove punctuation, lowercase
	var b strings.Builder
	for _, r := range strings.ToLower(s) {
		if r >= 'a' && r <= 'z' || r >= '0' && r <= '9' || r == ' ' {
			b.WriteRune(r)
		} else {
			b.WriteRune(' ')
		}
	}
	return strings.Join(strings.Fields(b.String()), " ")
}

func toStringMap(v any) map[string]string {
	result := map[string]string{}
	if m, ok := v.(map[string]any); ok {
		for k, val := range m {
			result[k] = normalizeToString(val)
		}
	}
	return result
}

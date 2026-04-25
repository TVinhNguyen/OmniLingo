package service

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/omnilingo/assessment-service/internal/domain"
)

// PlacementService provides placement test data and CEFR grading.
// Questions are statically embedded for MVP — move to DB in Phase 2.
type PlacementService interface {
	GetTest(lang, targetLang string) (*domain.PlacementTest, error)
	SubmitTest(testID string, answers []domain.PlacementAnswer) (*domain.PlacementResult, error)
}

type placementService struct {
	// testBank maps "lang:targetLang" → PlacementTest (with embedded answer key)
	testBank map[string]*domain.PlacementTest
}

// NewPlacementService builds the service and pre-loads the static question bank.
func NewPlacementService() PlacementService {
	s := &placementService{testBank: make(map[string]*domain.PlacementTest)}
	s.loadBank()
	return s
}

func (s *placementService) GetTest(lang, targetLang string) (*domain.PlacementTest, error) {
	key := lang + ":" + targetLang
	t, ok := s.testBank[key]
	if !ok {
		// Fall back to a generic English test if no specific pair found
		if t2, ok2 := s.testBank["en:en"]; ok2 {
			copy := *t2
			copy.TestID = uuid.New().String()
			copy.Lang = lang
			copy.TargetLang = targetLang
			return &copy, nil
		}
		return nil, &domain.DomainError{StatusCode: 404, Code: "NOT_FOUND", Message: fmt.Sprintf("no placement test for %s:%s", lang, targetLang)}
	}
	// Return a fresh copy with new testID each request (stateless for MVP)
	clone := *t
	clone.TestID = uuid.New().String()
	return &clone, nil
}

func (s *placementService) SubmitTest(testID string, answers []domain.PlacementAnswer) (*domain.PlacementResult, error) {
	if len(answers) == 0 {
		return nil, &domain.DomainError{StatusCode: 400, Code: "BAD_REQUEST", Message: "answers must not be empty"}
	}

	// Find the test by scanning all banks — testID is ephemeral per GetTest call.
	// For MVP correctness: we need the answer key. We store it inside the static bank
	// at a known key. We look for the first bank entry whose questions match.
	// Simplified: match on question IDs against any bank entry.
	var answerKey map[string]int
	for _, t := range s.testBank {
		if len(t.Questions) > 0 && t.Questions[0].ID == answers[0].QuestionID {
			answerKey = t.AnswerKey
			break
		}
		// Also check by question IDs match ratio
		idSet := make(map[string]bool, len(t.Questions))
		for _, q := range t.Questions {
			idSet[q.ID] = true
		}
		matchCount := 0
		for _, a := range answers {
			if idSet[a.QuestionID] { matchCount++ }
		}
		if matchCount > len(answers)/2 {
			answerKey = t.AnswerKey
			break
		}
	}

	correct := 0
	for _, a := range answers {
		if correctChoice, ok := answerKey[a.QuestionID]; ok {
			if a.Choice == correctChoice {
				correct++
			}
		}
	}

	total := len(answers)
	ratio := float64(correct) / float64(total)
	cefr := domain.CEFRFromScore(ratio)

	// Determine target language from first answer's question prefix (convention: "en-vi-q1" → "vi")
	targetLang := "en" // default
	if len(answers) > 0 && len(answers[0].QuestionID) >= 5 {
		// Try to parse "en-vi-q1" pattern
		qid := answers[0].QuestionID
		for _, t := range s.testBank {
			if len(t.Questions) > 0 && t.Questions[0].ID == qid {
				targetLang = t.TargetLang
				break
			}
		}
	}

	return &domain.PlacementResult{
		CEFR:               cefr,
		Score:              ratio,
		CorrectCount:       correct,
		TotalCount:         total,
		RecommendedTrackID: domain.TrackIDForCEFR(cefr, targetLang),
	}, nil
}

// ─── Static Question Bank ─────────────────────────────────────────────────────

func (s *placementService) loadBank() {
	s.registerTest(buildEnViTest())
	s.registerTest(buildEnEnTest())
}

func (s *placementService) registerTest(t *domain.PlacementTest) {
	key := t.Lang + ":" + t.TargetLang
	s.testBank[key] = t
}

// buildEnViTest builds the English UI → Vietnamese target placement test (12 questions).
func buildEnViTest() *domain.PlacementTest {
	questions := []domain.PlacementQuestion{
		{ID: "en-vi-q1",  Prompt: "What does 'xin chào' mean?",                           Choices: []string{"Goodbye", "Hello", "Thank you", "Excuse me"}, Skill: "vocabulary"},
		{ID: "en-vi-q2",  Prompt: "Which sentence is correct Vietnamese?",                  Choices: []string{"Tôi là học sinh.", "Học sinh là tôi.", "Là tôi học sinh.", "Tôi học sinh là."}, Skill: "grammar"},
		{ID: "en-vi-q3",  Prompt: "'Bạn có khỏe không?' means:",                            Choices: []string{"Where are you?", "How are you?", "What is your name?", "Do you speak Vietnamese?"}, Skill: "vocabulary"},
		{ID: "en-vi-q4",  Prompt: "How do you say 'I want to eat' in Vietnamese?",          Choices: []string{"Tôi muốn ăn", "Tôi ăn muốn", "Muốn tôi ăn", "Ăn tôi muốn"}, Skill: "grammar"},
		{ID: "en-vi-q5",  Prompt: "Which word means 'water'?",                              Choices: []string{"Cơm", "Nước", "Trứng", "Bánh"}, Skill: "vocabulary"},
		{ID: "en-vi-q6",  Prompt: "Complete: 'Hôm nay ___ đẹp.' (Today is beautiful)",     Choices: []string{"trời", "tôi", "bạn", "đây"}, Skill: "grammar"},
		{ID: "en-vi-q7",  Prompt: "'Tôi không hiểu' means:",                                Choices: []string{"I understand", "I don't understand", "I am learning", "I know"}, Skill: "vocabulary"},
		{ID: "en-vi-q8",  Prompt: "Choose the correct counter word: 'Ba ___ sách'",        Choices: []string{"con", "cái", "cuốn", "chiếc"}, Skill: "grammar"},
		{ID: "en-vi-q9",  Prompt: "Which sentence uses past tense correctly?",              Choices: []string{"Tôi ăn cơm đã.", "Tôi đã ăn cơm.", "Tôi ăn đã cơm.", "Đã tôi ăn cơm."}, Skill: "grammar"},
		{ID: "en-vi-q10", Prompt: "'Vừa … vừa' expresses:",                                 Choices: []string{"If … then", "Although … still", "Both … and simultaneously", "Before … after"}, Skill: "grammar"},
		{ID: "en-vi-q11", Prompt: "Read: 'Anh ấy nói rằng anh ấy sẽ đến.' Identify tense.", Choices: []string{"Present", "Reported future", "Past", "Conditional"}, Skill: "reading"},
		{ID: "en-vi-q12", Prompt: "Which is the most formal way to address an elder?",     Choices: []string{"Mày", "Bạn", "Ông/Bà", "Tao"}, Skill: "vocabulary"},
	}
	answerKey := map[string]int{
		"en-vi-q1": 1, "en-vi-q2": 0, "en-vi-q3": 1, "en-vi-q4": 0,
		"en-vi-q5": 1, "en-vi-q6": 0, "en-vi-q7": 1, "en-vi-q8": 2,
		"en-vi-q9": 1, "en-vi-q10": 2, "en-vi-q11": 1, "en-vi-q12": 2,
	}
	return &domain.PlacementTest{
		TestID: "static-en-vi", Lang: "en", TargetLang: "vi",
		Questions: questions, AnswerKey: answerKey,
	}
}

// buildEnEnTest builds a general English → English CEFR test (fallback).
func buildEnEnTest() *domain.PlacementTest {
	questions := []domain.PlacementQuestion{
		{ID: "en-en-q1",  Prompt: "She ___ to school every day.",                          Choices: []string{"go", "goes", "going", "gone"}, Skill: "grammar"},
		{ID: "en-en-q2",  Prompt: "What is the synonym of 'happy'?",                       Choices: []string{"Sad", "Angry", "Joyful", "Tired"}, Skill: "vocabulary"},
		{ID: "en-en-q3",  Prompt: "If I ___ rich, I would travel.",                        Choices: []string{"am", "was", "were", "be"}, Skill: "grammar"},
		{ID: "en-en-q4",  Prompt: "Choose the correct article: '___ honest man'",          Choices: []string{"a", "an", "the", "no article"}, Skill: "grammar"},
		{ID: "en-en-q5",  Prompt: "'Ubiquitous' means:",                                   Choices: []string{"Rare", "Present everywhere", "Dangerous", "Ancient"}, Skill: "vocabulary"},
		{ID: "en-en-q6",  Prompt: "She has been working here ___ 2015.",                   Choices: []string{"for", "since", "in", "at"}, Skill: "grammar"},
		{ID: "en-en-q7",  Prompt: "The report, along with its annexes, ___ submitted.",    Choices: []string{"are", "were", "was", "have"}, Skill: "grammar"},
		{ID: "en-en-q8",  Prompt: "'Notwithstanding' is closest in meaning to:",           Choices: []string{"Because of", "Despite", "In addition to", "Instead of"}, Skill: "vocabulary"},
		{ID: "en-en-q9",  Prompt: "Which is a dangling modifier?",                         Choices: []string{"Running fast, he caught the bus.", "Running fast, the bus was caught.", "He ran fast to catch the bus.", "The bus caught a fast runner."}, Skill: "grammar"},
		{ID: "en-en-q10", Prompt: "Identify the subjunctive: '___'",                       Choices: []string{"If I was you", "I suggested that he go.", "She is going home.", "They have arrived."}, Skill: "grammar"},
		{ID: "en-en-q11", Prompt: "'Ephemeral' describes:",                                 Choices: []string{"Something permanent", "Something brief", "Something large", "Something painful"}, Skill: "vocabulary"},
		{ID: "en-en-q12", Prompt: "Complex sentence: 'Although the task seemed impossible, she persevered.' The dependent clause signals:", Choices: []string{"Result", "Concession", "Purpose", "Condition"}, Skill: "reading"},
	}
	answerKey := map[string]int{
		"en-en-q1": 1, "en-en-q2": 2, "en-en-q3": 2, "en-en-q4": 1,
		"en-en-q5": 1, "en-en-q6": 1, "en-en-q7": 2, "en-en-q8": 1,
		"en-en-q9": 1, "en-en-q10": 1, "en-en-q11": 1, "en-en-q12": 1,
	}
	return &domain.PlacementTest{
		TestID: "static-en-en", Lang: "en", TargetLang: "en",
		Questions: questions, AnswerKey: answerKey,
	}
}

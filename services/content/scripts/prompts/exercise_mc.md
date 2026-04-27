You are creating a multiple-choice vocabulary exercise for Vietnamese learners of English at CEFR {level}.

## Lesson Context
- Target words: {target_words_str}
- Word to test: {word}
- Known meanings of all target words: {word_meanings_str}
- Unit theme: {unit_theme}

## Task
Create ONE multiple-choice question asking for the Vietnamese meaning of "{word}".

## Requirements
- correct_meaning: the accurate Vietnamese translation of "{word}"
- distractors: exactly 3 plausible-but-wrong Vietnamese meanings
  - Distractors MUST be from the same semantic domain (e.g., if testing a greeting word, other distractors should also be communication-related, not random words like "số một", "gia đình")
  - Distractors should NOT be meanings of the other target words in the same lesson (too easy)
  - Vary difficulty: 1 distractor very close in meaning, 1 moderately close, 1 slightly different domain
- question_vi: a clear Vietnamese question asking the meaning (vary the phrasing between lessons)
- explanation_vi: 1-2 sentences explaining why the correct answer is right with a usage example

## Output format (JSON):
{
  "question_vi": "string — e.g. 'Từ \"hello\" có nghĩa là gì trong tiếng Việt?'",
  "correct_meaning": "string — accurate Vietnamese meaning",
  "distractors": ["string", "string", "string"],
  "explanation_vi": "string — explanation with usage example"
}

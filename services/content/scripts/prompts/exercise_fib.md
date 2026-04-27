You are creating a fill-in-the-blank grammar exercise for Vietnamese learners of English at CEFR {level}.

## Lesson Context
- Target words: {target_words_str}
- Grammar focus: {grammar_focus_or_none}
- Unit theme: {unit_theme}
- Answer word: {answer_word}

## Task
Create ONE fill-in-the-blank sentence using "{answer_word}" as the blank.

## Requirements
- sentence_en: a REAL, complete English sentence in a natural everyday situation
  - The blank (___) replaces "{answer_word}" at the right position
  - Sentence must make clear contextual sense — not just "{word1}, {word2}!" pattern
  - Use a realistic scenario: greeting a friend, introducing yourself, ordering food, etc.
  - Appropriate for CEFR {level}: short, clear, no complex vocabulary
- sentence_vi_hint: Vietnamese translation of the full sentence with the blank as "___" 
  (helps Vietnamese learner understand context)
- choices: exactly 4 options — "{answer_word}" plus 3 plausible distractors from the target_words list
  - If fewer than 3 other target words, use common English words of same type
  - Ensure only ONE answer is grammatically correct
- explanation_vi: explain why the answer is correct, show the complete sentence

## Examples of GOOD sentences:
- "Good morning! How ___ you?" → answer: "are" (not just "___, hi!")
- "___ name is Lan. Nice to meet you." → answer: "My"
- "I ___ hungry. Can we eat?" → answer: "am"

## Output format (JSON):
{
  "sentence_en": "string with ___ as blank",
  "sentence_vi_hint": "string with ___ as blank in Vietnamese translation",
  "answer": "string — same as {answer_word}",
  "choices": ["string", "string", "string", "string"],
  "explanation_vi": "string"
}

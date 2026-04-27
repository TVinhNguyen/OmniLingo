You are creating a word-meaning matching exercise for Vietnamese learners of English at CEFR {level}.

## Lesson Context
- Target words and their meanings: {word_meanings_str}
- Unit theme: {unit_theme}

## Task
Create a matching exercise pairing each English word with its Vietnamese meaning.

## Requirements
- Include ALL target words provided: {target_words_str}
- Each pair: left = English word, right = Vietnamese meaning
- Vietnamese meanings must be accurate and natural (how a Vietnamese person would actually say it)
  - Prefer short, common forms: "xin chào" not "lời chào hỏi trang trọng"
  - If a word has multiple meanings, use the most relevant one for the lesson context
- Max 6 pairs (if more than 6 words, choose the 6 most important)
- explanation_vi: a 1-2 sentence tip for remembering these words (memory hook, usage pattern, etc.)
  - NOT just "Hãy nhớ nghĩa chính của từng từ" (too generic)
  - Example: "Để nhớ 'goodbye', hãy nghĩ đến 'good' (tốt) + 'bye' — tạm biệt tốt lành!"

## Output format (JSON):
{
  "pairs": [
    {"left": "english_word", "right": "nghĩa tiếng Việt"},
    ...
  ],
  "explanation_vi": "string — memorable tip for learning these words"
}

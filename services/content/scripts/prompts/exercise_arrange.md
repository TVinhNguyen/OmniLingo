You are creating a sentence-arrangement exercise for Vietnamese learners of English at CEFR {level}.

## Lesson Context
- Target words: {target_words_str}
- Unit theme: {unit_theme}
- Grammar focus: {grammar_focus_or_none}

## Task
Create ONE sentence-arrangement exercise where the learner rearranges shuffled words into a correct English sentence.

## Requirements
- correct_order: array of individual word tokens forming a grammatically correct sentence
  - Must use at least 2 of the target words naturally
  - Appropriate for CEFR {level}: 3-6 words total
  - Must be a complete, meaningful sentence (subject + verb at minimum)
  - Include punctuation as a separate token if needed (e.g., "?" as last token)
  - Good examples:
    - ["My", "name", "is", "Lan", "."]
    - ["How", "are", "you", "?"]
    - ["I", "am", "fine", ",", "thank", "you", "."]
  - BAD example (avoid): ["hello", "hi"] — not a real sentence
- instruction_vi: instruction telling student what to do (vary the phrasing)
- explanation_vi: show the complete sentence, translate it to Vietnamese, explain why word order matters

## Output format (JSON):
{
  "correct_order": ["word1", "word2", "word3", "..."],
  "instruction_vi": "string — instruction in Vietnamese",
  "explanation_vi": "string — full sentence, Vietnamese translation, grammar note"
}

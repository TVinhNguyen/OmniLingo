You are creating a dictation (listening) exercise for Vietnamese learners of English at CEFR {level}.

## Lesson Context
- Target words: {target_words_str}
- Primary word: {primary_word}
- Unit theme: {unit_theme}

## Task
Create ONE dictation exercise where the learner listens to a short English phrase and types what they hear.

## Requirements
- reference_text: a SHORT English phrase or sentence (3-7 words) that:
  - Naturally uses "{primary_word}" 
  - Is a realistic, common phrase (not invented academic text)
  - Is appropriate for CEFR {level}: no complex vocabulary, short
  - Examples: "Hello! How are you?", "My name is Lan.", "Good morning, everyone!"
  - NOT just the single word "{primary_word}" alone (that's too easy and unnatural)
- instruction_vi: clear Vietnamese instruction telling learner to listen and type
  - Vary the phrasing: don't always use "Nghe audio và gõ lại"
- explanation_vi: after completing the exercise, explain the phrase in Vietnamese: 
  - Translation of the phrase
  - When/where one would typically say this

## Output format (JSON):
{
  "reference_text": "string — short natural English phrase using {primary_word}",
  "instruction_vi": "string — instruction in Vietnamese",
  "explanation_vi": "string — Vietnamese explanation of the phrase and its usage context"
}

"""common/lesson_factory.py — Lesson and exercise builder.

Two modes:
  1. LLM mode  (build_llm_lesson)   — Gemini 2.0 Flash generates diverse content
  2. Rule mode (build_rule_based_lesson) — deterministic templates, used as fallback

Public API:
    build_lesson(client, ...) → GeneratedLesson
        Tries LLM if client is not None; falls back to rule-based on any failure.

    build_rule_based_lesson(...) → GeneratedLesson
        Pure rule-based, no network calls.

    build_llm_lesson(client, ...) → GeneratedLesson
        Async, requires a GeminiClient.
"""
from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import TYPE_CHECKING

from pydantic import BaseModel, Field

from common.schema import (
    CreateLessonPayload,
    Exercise,
    ExerciseType,
    GeneratedLesson,
    LessonBlock,
    LessonBlockType,
)
from common.vocab_query import VocabEntry

if TYPE_CHECKING:
    from common.llm_client import GeminiClient


log = logging.getLogger(__name__)

# ── Prompt loading ────────────────────────────────────────────────────────────

_PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"


def _load_prompt(name: str) -> str:
    path = _PROMPTS_DIR / name
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")
    return path.read_text(encoding="utf-8")


def _fill_prompt(template: str, **kwargs: str) -> str:
    """Substitute {var_name} placeholders in a prompt template.

    Unlike str.format(), this only replaces KNOWN variable names from kwargs,
    leaving all other curly-brace content (e.g. JSON output examples) intact.
    This avoids KeyError when prompt files contain JSON like {"key": "value"}.
    """
    import re
    def replacer(match: re.Match) -> str:
        key = match.group(1)
        return str(kwargs[key]) if key in kwargs else match.group(0)
    return re.sub(r"\{(\w+)\}", replacer, template)


# ── Pydantic schemas for LLM structured output ───────────────────────────────

class LessonIntroOutput(BaseModel):
    intro_vi: str
    grammar_vi: str


class MCOutput(BaseModel):
    question_vi: str
    correct_meaning: str
    distractors: list[str] = Field(min_length=3, max_length=3)
    explanation_vi: str


class FIBOutput(BaseModel):
    sentence_en: str
    sentence_vi_hint: str
    answer: str
    choices: list[str] = Field(min_length=2, max_length=4)
    explanation_vi: str


class MatchPair(BaseModel):
    left: str   # English word
    right: str  # Vietnamese meaning


class MatchOutput(BaseModel):
    pairs: list[MatchPair] = Field(min_length=2, max_length=6)
    explanation_vi: str


class DictationOutput(BaseModel):
    reference_text: str
    instruction_vi: str
    explanation_vi: str


class ArrangeOutput(BaseModel):
    correct_order: list[str] = Field(min_length=2, max_length=10)
    instruction_vi: str
    explanation_vi: str


# ── Fallback meanings (rule-based mode) ──────────────────────────────────────

FALLBACK_MEANINGS: dict[str, str] = {
    "hello": "xin chào", "hi": "chào", "hey": "này/chào",
    "goodbye": "tạm biệt", "bye": "tạm biệt",
    "thanks": "cảm ơn", "thank": "cảm ơn", "please": "làm ơn",
    "sorry": "xin lỗi", "excuse": "xin phép", "welcome": "không có gì",
    "yes": "có/vâng", "no": "không", "not": "không", "okay": "được rồi",
    "you": "bạn", "my": "của tôi", "your": "của bạn",
    "his": "của anh ấy", "her": "của cô ấy",
    "name": "tên", "am": "là", "is": "là", "are": "là/ở",
    "how": "như thế nào", "fine": "khỏe", "see": "gặp", "later": "sau",
    "who": "ai", "this": "này", "that": "đó", "they": "họ",
    "family": "gia đình", "mother": "mẹ", "father": "bố",
    "sister": "chị/em gái", "brother": "anh/em trai",
    "parent": "phụ huynh", "child": "đứa trẻ", "son": "con trai",
    "daughter": "con gái", "husband": "chồng", "wife": "vợ",
    "married": "đã kết hôn", "single": "độc thân",
    "big": "to/lớn", "small": "nhỏ", "old": "già/cũ", "young": "trẻ",
    "home": "nhà", "house": "ngôi nhà", "people": "mọi người", "live": "sống",
    "one": "một", "two": "hai", "three": "ba", "four": "bốn", "five": "năm",
    "six": "sáu", "seven": "bảy", "eight": "tám", "nine": "chín", "ten": "mười",
    "age": "tuổi", "years": "năm", "day": "ngày", "week": "tuần",
    "monday": "thứ Hai", "friday": "thứ Sáu",
    "today": "hôm nay", "tomorrow": "ngày mai", "yesterday": "hôm qua", "now": "bây giờ",
    "time": "thời gian", "hour": "giờ", "minute": "phút",
    "late": "muộn", "early": "sớm", "what": "cái gì", "it": "nó",
    "food": "đồ ăn", "rice": "cơm", "bread": "bánh mì", "egg": "trứng", "soup": "canh/súp",
    "water": "nước", "tea": "trà", "coffee": "cà phê", "milk": "sữa", "juice": "nước ép",
    "like": "thích", "love": "yêu/rất thích", "want": "muốn",
    "eat": "ăn", "drink": "uống", "order": "gọi (đồ)", "menu": "thực đơn",
    "good": "tốt/ngon", "bad": "xấu/tệ", "hot": "nóng", "cold": "lạnh", "sweet": "ngọt",
    "breakfast": "bữa sáng", "lunch": "bữa trưa", "dinner": "bữa tối", "meal": "bữa ăn",
    "table": "bàn", "bill": "hóa đơn", "waiter": "bồi bàn", "restaurant": "nhà hàng",
    "go": "đi", "come": "đến", "do": "làm", "make": "làm/tạo", "get": "lấy/được",
    "school": "trường học", "work": "công việc/đi làm", "market": "chợ", "park": "công viên",
    "wake": "thức dậy", "sleep": "ngủ", "study": "học", "bus": "xe buýt",
    "car": "ô tô", "bike": "xe đạp", "walk": "đi bộ", "taxi": "taxi",
    "sunny": "nắng", "rainy": "mưa", "weather": "thời tiết",
    "happy": "vui", "sad": "buồn", "tired": "mệt", "hungry": "đói", "thirsty": "khát",
    "help": "giúp đỡ", "open": "mở", "close": "đóng", "read": "đọc", "write": "viết",
    "morning": "buổi sáng", "afternoon": "buổi chiều", "evening": "buổi tối", "night": "đêm",
    "teacher": "giáo viên", "student": "học sinh", "class": "lớp học", "ready": "sẵn sàng",
    "greetings": "lời chào", "can": "có thể",
}


def _meaning(entry: VocabEntry | None, lemma: str) -> str:
    if entry and entry.meanings:
        return entry.meanings[0]
    return FALLBACK_MEANINGS.get(lemma.lower(), lemma)


def _entry_map(entries: list[VocabEntry]) -> dict[str, VocabEntry]:
    return {entry.lemma.lower(): entry for entry in entries}


def _exercise_id(unit_id: str, lesson_id: str, suffix: str) -> str:
    return f"{unit_id}_{lesson_id}_{suffix}"


def _word_meanings_str(words: list[str], entry_map: dict[str, VocabEntry]) -> str:
    parts = [f"{w}: {_meaning(entry_map.get(w.lower()), w)}" for w in words]
    return ", ".join(parts)


# ── LLM-based generation ──────────────────────────────────────────────────────

async def build_llm_lesson(
    client: GeminiClient,
    track_id: str,
    unit_id: str,
    lesson_config: dict,
    entries: list[VocabEntry],
    language: str = "en",
    ui_language: str = "vi",
    level: str = "A1",
) -> GeneratedLesson:
    """Generate a lesson using Gemini AI for rich, diverse content.

    Falls back to rule-based for any individual exercise that fails, so the
    overall lesson always completes even on partial LLM errors.
    """
    lesson_id = lesson_config["id"]
    title = lesson_config["title"]
    target_words = [str(w) for w in lesson_config.get("target_words", [])]
    grammar_focus = lesson_config.get("grammar_focus")
    unit_theme = lesson_config.get("theme", unit_id)

    if not target_words or len(target_words) < 2:
        raise ValueError(
            f"[B8] lesson '{lesson_id}' needs at least 2 target_words (got {len(target_words)})"
        )

    entry_map = _entry_map(entries)
    words_str = ", ".join(target_words)
    meanings_str = _word_meanings_str(target_words, entry_map)
    grammar_str = grammar_focus or "không có grammar focus đặc biệt"

    # ── 1. Intro text ─────────────────────────────────────────────────────────
    intro_prompt = _fill_prompt(
        _load_prompt("lesson_intro.md"),
        title=title,
        target_words_str=words_str,
        grammar_focus_or_none=grammar_str,
        unit_theme=unit_theme,
        level=level,
    )
    try:
        intro_data = await client.generate_json(intro_prompt, LessonIntroOutput)
        intro_vi = intro_data.intro_vi
        grammar_vi = intro_data.grammar_vi
    except Exception as exc:
        log.warning("[llm] intro failed for '%s', using rule-based: %s", lesson_id, exc)
        intro_vi, grammar_vi = _rule_intro(title, grammar_focus)

    # ── 2. Exercises (run concurrently with a sem to stay under rate limit) ──
    sem = asyncio.Semaphore(3)  # max 3 concurrent Gemini calls per lesson

    async def _guarded(coro, fallback_fn, ex_name: str):
        async with sem:
            try:
                return await coro
            except Exception as exc:
                log.warning("[llm] exercise '%s' failed, using fallback: %s", ex_name, exc)
                return fallback_fn()

    first_word = target_words[0]
    second_word = target_words[1]

    mc_coro = _gen_mc(client, level, target_words, words_str, meanings_str, first_word, unit_theme)
    fib_coro = _gen_fib(client, level, target_words, words_str, grammar_str, second_word, unit_theme)
    match_coro = _gen_match(client, level, target_words, words_str, meanings_str, unit_theme)
    dict_coro = _gen_dictation(client, level, target_words, words_str, first_word, unit_theme)
    arr_coro = _gen_arrange(client, level, target_words, words_str, grammar_str, unit_theme)

    mc_out, fib_out, match_out, dict_out, arr_out = await asyncio.gather(
        _guarded(mc_coro, lambda: None, "mc"),
        _guarded(fib_coro, lambda: None, "fib"),
        _guarded(match_coro, lambda: None, "match"),
        _guarded(dict_coro, lambda: None, "dictation"),
        _guarded(arr_coro, lambda: None, "arrange"),
    )

    # Build exercises — fall back to rule-based for any None result
    exercises = _assemble_exercises(
        unit_id, lesson_id, language, level, ui_language,
        target_words, entry_map,
        track_id=track_id,
        mc_out=mc_out, fib_out=fib_out, match_out=match_out,
        dict_out=dict_out, arr_out=arr_out,
    )

    lesson = CreateLessonPayload(
        language=language,
        track=track_id,
        level=level,
        unitId=unit_id,
        title={ui_language: title, language: title},
        objective={ui_language: f"Nhận biết và dùng tự nhiên: {', '.join(target_words[:4])}."},
        estimatedMinutes=int(lesson_config.get("target_minutes", 5)),
        blocks=[
            LessonBlock(type=LessonBlockType.EXPLANATION, content={ui_language: intro_vi}),
            LessonBlock(type=LessonBlockType.VOCAB_INTRO, words=target_words),
            LessonBlock(type=LessonBlockType.EXPLANATION, content={ui_language: grammar_vi}),
            *[LessonBlock(type=LessonBlockType.EXERCISE, exerciseId=ex.id) for ex in exercises],
        ],
    )
    return GeneratedLesson(lesson=lesson, exercises=exercises)


# ── Individual exercise generators ───────────────────────────────────────────

async def _gen_mc(
    client: GeminiClient, level: str,
    target_words: list[str], words_str: str, meanings_str: str,
    word: str, unit_theme: str,
) -> MCOutput:
    prompt = _fill_prompt(
        _load_prompt("exercise_mc.md"),
        level=level,
        target_words_str=words_str,
        word=word,
        word_meanings_str=meanings_str,
        unit_theme=unit_theme,
    )
    return await client.generate_json(prompt, MCOutput)


async def _gen_fib(
    client: GeminiClient, level: str,
    target_words: list[str], words_str: str, grammar_str: str,
    answer_word: str, unit_theme: str,
) -> FIBOutput:
    prompt = _fill_prompt(
        _load_prompt("exercise_fib.md"),
        level=level,
        target_words_str=words_str,
        grammar_focus_or_none=grammar_str,
        answer_word=answer_word,
        unit_theme=unit_theme,
    )
    return await client.generate_json(prompt, FIBOutput)


async def _gen_match(
    client: GeminiClient, level: str,
    target_words: list[str], words_str: str, meanings_str: str,
    unit_theme: str,
) -> MatchOutput:
    prompt = _fill_prompt(
        _load_prompt("exercise_match.md"),
        level=level,
        target_words_str=words_str,
        word_meanings_str=meanings_str,
        unit_theme=unit_theme,
    )
    return await client.generate_json(prompt, MatchOutput)


async def _gen_dictation(
    client: GeminiClient, level: str,
    target_words: list[str], words_str: str,
    primary_word: str, unit_theme: str,
) -> DictationOutput:
    prompt = _fill_prompt(
        _load_prompt("exercise_dictation.md"),
        level=level,
        target_words_str=words_str,
        primary_word=primary_word,
        unit_theme=unit_theme,
    )
    return await client.generate_json(prompt, DictationOutput)


async def _gen_arrange(
    client: GeminiClient, level: str,
    target_words: list[str], words_str: str, grammar_str: str,
    unit_theme: str,
) -> ArrangeOutput:
    prompt = _fill_prompt(
        _load_prompt("exercise_arrange.md"),
        level=level,
        target_words_str=words_str,
        grammar_focus_or_none=grammar_str,
        unit_theme=unit_theme,
    )
    return await client.generate_json(prompt, ArrangeOutput)


# ── Exercise assembler (LLM output → Exercise models) ────────────────────────

def _assemble_exercises(
    unit_id: str,
    lesson_id: str,
    language: str,
    level: str,
    ui_language: str,
    target_words: list[str],
    entry_map: dict[str, VocabEntry],
    *,
    track_id: str,
    mc_out: MCOutput | None,
    fib_out: FIBOutput | None,
    match_out: MatchOutput | None,
    dict_out: DictationOutput | None,
    arr_out: ArrangeOutput | None,
) -> list[Exercise]:
    first_word = target_words[0]
    second_word = target_words[1]
    tags = [track_id, unit_id, lesson_id]

    def _xid(suffix: str) -> str:
        return _exercise_id(unit_id, lesson_id, suffix)

    # ── Multiple Choice ───────────────────────────────────────────────────────
    if mc_out is not None:
        all_choices = [mc_out.correct_meaning] + mc_out.distractors[:3]
        mc_ex = Exercise(
            id=_xid("mc_1"),
            type=ExerciseType.MULTIPLE_CHOICE,
            language=language, level=level, skill="vocabulary",
            prompt={"text": {ui_language: mc_out.question_vi}},
            choices=all_choices,
            answer=0,
            explanation={ui_language: mc_out.explanation_vi},
            tags=tags, difficulty=0.2,
        )
    else:
        first_meaning = _meaning(entry_map.get(first_word.lower()), first_word)
        mc_ex = Exercise(
            id=_xid("mc_1"),
            type=ExerciseType.MULTIPLE_CHOICE,
            language=language, level=level, skill="vocabulary",
            prompt={"text": {ui_language: f"'{first_word}' có nghĩa là gì?"}},
            choices=[first_meaning, "tạm biệt", "gia đình", "số một"],
            answer=0,
            explanation={ui_language: f"'{first_word}' nghĩa là '{first_meaning}'."},
            tags=tags, difficulty=0.2,
        )

    # ── Fill-in-Blank ─────────────────────────────────────────────────────────
    if fib_out is not None:
        choices = list(dict.fromkeys(fib_out.choices))  # deduplicate, preserve order
        if fib_out.answer not in choices:
            choices = [fib_out.answer] + choices[:3]
        fib_ex = Exercise(
            id=_xid("gap_1"),
            type=ExerciseType.FILL_IN_BLANK,
            language=language, level=level, skill="grammar",
            prompt={"text": {
                ui_language: fib_out.sentence_vi_hint,
                language: fib_out.sentence_en,
            }},
            choices=choices[:4],
            answer=fib_out.answer,
            explanation={ui_language: fib_out.explanation_vi},
            tags=tags, difficulty=0.35,
        )
    else:
        fib_ex = Exercise(
            id=_xid("gap_1"),
            type=ExerciseType.FILL_IN_BLANK,
            language=language, level=level, skill="grammar",
            prompt={"text": {
                ui_language: "Điền từ còn thiếu vào câu.",
                language: f"___, {second_word}!",
            }},
            choices=list(dict.fromkeys(target_words[:4])),
            answer=first_word,
            explanation={ui_language: f"Câu đúng là '{first_word}, {second_word}!'."},
            tags=tags, difficulty=0.35,
        )

    # ── Matching ──────────────────────────────────────────────────────────────
    if match_out is not None and match_out.pairs:
        pairs = [{"left": p.left, "right": p.right} for p in match_out.pairs[:6]]
        match_ex = Exercise(
            id=_xid("match_1"),
            type=ExerciseType.MATCHING,
            language=language, level=level, skill="vocabulary",
            prompt={"text": {ui_language: "Ghép từ tiếng Anh với nghĩa tiếng Việt."}},
            pairs=pairs,
            answer=[p["left"] for p in pairs],
            explanation={ui_language: match_out.explanation_vi},
            tags=tags, difficulty=0.4,
        )
    else:
        words_with_meanings = [
            (w, _meaning(entry_map.get(w.lower()), w)) for w in target_words
        ]
        match_ex = Exercise(
            id=_xid("match_1"),
            type=ExerciseType.MATCHING,
            language=language, level=level, skill="vocabulary",
            prompt={"text": {ui_language: "Ghép từ tiếng Anh với nghĩa tiếng Việt."}},
            pairs=[{"left": w, "right": m} for w, m in words_with_meanings[:6]],
            answer=[w for w, _ in words_with_meanings[:6]],
            explanation={ui_language: "Hãy nhớ nghĩa chính của từng từ."},
            tags=tags, difficulty=0.4,
        )

    # ── Dictation ─────────────────────────────────────────────────────────────
    if dict_out is not None:
        dict_ex = Exercise(
            id=_xid("audio_1"),
            type=ExerciseType.DICTATION,
            language=language, level=level, skill="listening",
            prompt={"text": {ui_language: dict_out.instruction_vi}},
            answer=dict_out.reference_text,
            referenceText=dict_out.reference_text,
            lengthSeconds=max(3, len(dict_out.reference_text.split()) * 1),
            explanation={ui_language: dict_out.explanation_vi},
            tags=tags, difficulty=0.45,
        )
    else:
        dict_ex = Exercise(
            id=_xid("audio_1"),
            type=ExerciseType.DICTATION,
            language=language, level=level, skill="listening",
            prompt={"text": {ui_language: "Nghe audio và gõ lại từ bạn nghe được."}},
            answer=first_word,
            referenceText=first_word,
            lengthSeconds=3,
            explanation={ui_language: f"Từ cần nghe là '{first_word}'."},
            tags=tags, difficulty=0.45,
        )

    # ── Sentence Arrange ──────────────────────────────────────────────────────
    if arr_out is not None and len(arr_out.correct_order) >= 2:
        tokens = arr_out.correct_order
        correct_sentence = " ".join(tokens)
        # Shuffle tokens for display (stable shuffle via sorted)
        import random
        shuffled = tokens.copy()
        random.shuffle(shuffled)
        # Deduplicate while preserving all tokens (index-based)
        arr_ex = Exercise(
            id=_xid("construct_1"),
            type=ExerciseType.SENTENCE_ARRANGE,
            language=language, level=level, skill="writing",
            prompt={"text": {ui_language: arr_out.instruction_vi}},
            choices=shuffled,
            answer=correct_sentence,
            explanation={ui_language: arr_out.explanation_vi},
            tags=tags, difficulty=0.5,
        )
    else:
        arr_ex = Exercise(
            id=_xid("construct_1"),
            type=ExerciseType.SENTENCE_ARRANGE,
            language=language, level=level, skill="writing",
            prompt={"text": {ui_language: "Sắp xếp các mảnh để tạo câu đúng."}},
            choices=list(dict.fromkeys([second_word, first_word] + target_words[2:4])),
            answer=f"{first_word} {second_word}",
            explanation={ui_language: f"Thứ tự đúng là '{first_word} {second_word}'."},
            tags=tags, difficulty=0.5,
        )

    return [mc_ex, fib_ex, match_ex, dict_ex, arr_ex]


def _rule_intro(title: str, grammar_focus: str | None) -> tuple[str, str]:
    """Rule-based fallback intro strings."""
    intro = (
        f"Hôm nay bạn sẽ luyện tập các từ trong chủ đề '{title}'. "
        "Đây là những từ thiết yếu trong giao tiếp tiếng Anh hằng ngày — "
        "hãy chú ý đến phát âm và ngữ cảnh sử dụng."
    )
    if grammar_focus:
        grammar = (
            f"Điểm ngữ pháp cần nhớ: {grammar_focus}. "
            "Hãy thử tạo câu đơn giản với cấu trúc này trước khi làm bài tập."
        )
    else:
        grammar = (
            "Không có điểm ngữ pháp mới trong bài này. "
            "Tập trung vào việc ghi nhớ nghĩa và cách dùng từ trong câu thật."
        )
    return intro, grammar


# ── Rule-based lesson (deterministic fallback) ────────────────────────────────

def build_rule_based_lesson(
    track_id: str,
    unit_id: str,
    lesson_config: dict,
    entries: list[VocabEntry],
    language: str = "en",
    ui_language: str = "vi",
    level: str = "A1",
) -> GeneratedLesson:
    """Deterministic rule-based lesson builder — no LLM, no network."""
    lesson_id = lesson_config["id"]
    title = lesson_config["title"]
    target_words = [str(w) for w in lesson_config.get("target_words", [])]
    grammar_focus = lesson_config.get("grammar_focus")

    if not target_words:
        raise ValueError(
            f"[B8] lesson '{lesson_id}' has no target_words. "
            "Add at least 2 entries in the track YAML."
        )
    if len(target_words) == 1:
        raise ValueError(
            f"[B8] lesson '{lesson_id}' has only 1 target_word ('{target_words[0]}'). "
            "Add at least 1 more word — exercises need ≥2 distinct words."
        )

    entry_map = _entry_map(entries)
    words_with_meanings = [(w, _meaning(entry_map.get(w.lower()), w)) for w in target_words]
    first_word = target_words[0]
    second_word = target_words[1]
    intro_vi, grammar_vi = _rule_intro(title, grammar_focus)
    tags = [track_id, unit_id, lesson_id]

    def _xid(suffix: str) -> str:
        return _exercise_id(unit_id, lesson_id, suffix)

    first_meaning = _meaning(entry_map.get(first_word.lower()), first_word)

    exercises = [
        Exercise(
            id=_xid("mc_1"),
            type=ExerciseType.MULTIPLE_CHOICE,
            language=language, level=level, skill="vocabulary",
            prompt={"text": {ui_language: f"'{first_word}' có nghĩa là gì?"}},
            choices=[first_meaning, "tạm biệt", "gia đình", "số một"],
            answer=0,
            explanation={ui_language: f"'{first_word}' nghĩa là '{first_meaning}'."},
            tags=tags, difficulty=0.2,
        ),
        Exercise(
            id=_xid("gap_1"),
            type=ExerciseType.FILL_IN_BLANK,
            language=language, level=level, skill="grammar",
            prompt={"text": {
                ui_language: "Điền từ còn thiếu vào câu.",
                language: f"___, {second_word}!",
            }},
            choices=list(dict.fromkeys(target_words[:4])) if len(target_words) >= 2 else [first_word, second_word],
            answer=first_word,
            explanation={ui_language: f"Câu đúng là '{first_word}, {second_word}!'."},
            tags=tags, difficulty=0.35,
        ),
        Exercise(
            id=_xid("match_1"),
            type=ExerciseType.MATCHING,
            language=language, level=level, skill="vocabulary",
            prompt={"text": {ui_language: "Ghép từ tiếng Anh với nghĩa tiếng Việt."}},
            pairs=[{"left": w, "right": m} for w, m in words_with_meanings[:6]],
            answer=[w for w, _ in words_with_meanings[:6]],
            explanation={ui_language: "Hãy nhớ nghĩa chính của từng từ trong chủ đề."},
            tags=tags, difficulty=0.4,
        ),
        Exercise(
            id=_xid("audio_1"),
            type=ExerciseType.DICTATION,
            language=language, level=level, skill="listening",
            prompt={"text": {ui_language: "Nghe audio và gõ lại từ bạn nghe được."}},
            answer=first_word, referenceText=first_word, lengthSeconds=3,
            explanation={ui_language: f"Từ cần nghe là '{first_word}'."},
            tags=tags, difficulty=0.45,
        ),
        Exercise(
            id=_xid("construct_1"),
            type=ExerciseType.SENTENCE_ARRANGE,
            language=language, level=level, skill="writing",
            prompt={"text": {ui_language: "Sắp xếp các mảnh để tạo câu đúng."}},
            choices=list(dict.fromkeys([second_word, first_word] + target_words[2:4])),
            answer=f"{first_word} {second_word}",
            explanation={ui_language: f"Thứ tự đúng là '{first_word} {second_word}'."},
            tags=tags, difficulty=0.5,
        ),
    ]

    lesson = CreateLessonPayload(
        language=language,
        track=track_id,
        level=level,
        unitId=unit_id,
        title={ui_language: title, language: title},
        objective={ui_language: f"Nhận biết và dùng {', '.join(target_words[:4])}."},
        estimatedMinutes=int(lesson_config.get("target_minutes", 5)),
        blocks=[
            LessonBlock(type=LessonBlockType.EXPLANATION, content={ui_language: intro_vi}),
            LessonBlock(type=LessonBlockType.VOCAB_INTRO, words=target_words),
            LessonBlock(type=LessonBlockType.EXPLANATION, content={ui_language: grammar_vi}),
            *[LessonBlock(type=LessonBlockType.EXERCISE, exerciseId=ex.id) for ex in exercises],
        ],
    )
    return GeneratedLesson(lesson=lesson, exercises=exercises)


# ── Public façade ─────────────────────────────────────────────────────────────

async def build_lesson(
    client: GeminiClient | None,
    track_id: str,
    unit_id: str,
    lesson_config: dict,
    entries: list[VocabEntry],
    language: str = "en",
    ui_language: str = "vi",
    level: str = "A1",
) -> GeneratedLesson:
    """Generate a lesson — LLM if client is available, rule-based otherwise.

    This is the recommended entry point for all generators.
    """
    if client is not None:
        try:
            return await build_llm_lesson(
                client, track_id, unit_id, lesson_config, entries,
                language, ui_language, level,
            )
        except Exception as exc:
            log.warning(
                "[lesson_factory] LLM build failed for '%s', falling back to rule-based: %s",
                lesson_config.get("id"),
                exc,
            )

    # Rule-based path (sync wrapped in async)
    return build_rule_based_lesson(
        track_id, unit_id, lesson_config, entries, language, ui_language, level,
    )

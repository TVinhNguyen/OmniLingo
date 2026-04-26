from __future__ import annotations

import asyncio
import json
import os
import uuid
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Iterable

try:
    import asyncpg
except ImportError:  # pragma: no cover - lets no-data smoke runs skip dependency install.
    asyncpg = None


CACHE_DIR = Path(__file__).resolve().parent / ".cache"
DEFAULT_FREQUENCY_RANK = 999_999
BATCH_SIZE = 1_000


POS_MAP = {
    # nouns
    "n": "noun", "n-suf": "noun", "n-pref": "noun",
    "n-adv": "noun", "n-t": "noun", "n-pn": "noun",
    "pn": "pronoun",
    # verbs — ichidan
    "v1": "verb", "v1-s": "verb",
    # verbs — godan
    "v5": "verb", "v5b": "verb", "v5g": "verb",
    "v5k": "verb", "v5k-s": "verb", "v5m": "verb",
    "v5n": "verb", "v5r": "verb", "v5r-i": "verb",
    "v5s": "verb", "v5t": "verb", "v5u": "verb",
    "v5u-s": "verb", "v5uru": "verb", "v5y": "verb",
    "v5z": "verb",
    # verbs — suru / special
    "vs": "verb", "vs-i": "verb", "vs-s": "verb",
    "vk": "verb", "vz": "verb",
    "vi": "verb", "vt": "verb",
    "v": "verb",
    # aux
    "aux-v": "verb", "aux": "verb", "cop": "verb",
    # adjectives
    "adj": "adjective", "adj-i": "adjective", "adj-na": "adjective",
    "adj-no": "adjective", "adj-pn": "adjective", "adj-t": "adjective",
    "adj-f": "adjective", "adj-ix": "adjective",
    # adverbs
    "adv": "adverb", "adv-to": "adverb",
    # function words
    "prep": "preposition", "conj": "conjunction",
    "int": "interjection", "exp": "expression",
    "prt": "particle", "aux": "verb",
    # numerals / counters
    "ctr": "counter", "num": "numeric",
}


@dataclass(slots=True)
class WordRow:
    language: str
    lemma: str
    reading: str = ""
    pos: str = ""
    ipa: str = ""
    frequency_rank: int = DEFAULT_FREQUENCY_RANK
    level: str = ""
    extra: dict[str, Any] = field(default_factory=dict)
    source: str = ""
    source_id: str = ""
    meanings: list[tuple[str, str, int]] = field(default_factory=list)
    examples: list[tuple[str, dict[str, str], str]] = field(default_factory=list)
    id: uuid.UUID = field(default_factory=uuid.uuid4)


def normalize_pos(raw: str | Iterable[str]) -> str:
    if isinstance(raw, str):
        tags = [raw]
    else:
        tags = list(raw)
    for tag in tags:
        clean = tag.strip().lower()
        if clean in POS_MAP:
            return POS_MAP[clean]
        for prefix, value in POS_MAP.items():
            if clean.startswith(prefix):
                return value
    return tags[0].strip().lower() if tags else ""


def load_frequency_file(path: Path) -> dict[str, tuple[int, str]]:
    """Load a TSV file mapping lemma → (rank, level).

    Used for JLPT/HSK **level** tagging only (e.g. 'jlpt_n5', 'hsk1').
    Frequency ranking is handled by corpus_freq_rank() instead.
    """
    if not path.exists():
        return {}
    out: dict[str, tuple[int, str]] = {}
    with path.open("r", encoding="utf-8") as fh:
        for rank, line in enumerate(fh, start=1):
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            parts = [p.strip() for p in line.replace(",", "\t").split("\t") if p.strip()]
            lemma = parts[0]
            level = parts[1].lower() if len(parts) > 1 else ""
            out[lemma] = (rank, level)
    return out


# ─── Corpus frequency ranking (wordfreq top-N lookup) ────────────────────────
# Uses top_n_list positional index → true ordinal rank, not a lossy log formula.
# Cache is per-language and built on first access.

_TOP_RANK_CACHE: dict[str, dict[str, int]] = {}


def _load_top_rank(lang: str) -> dict[str, int]:
    """Build {lemma → rank} from wordfreq top-200k for *lang*, cached in-process."""
    if lang not in _TOP_RANK_CACHE:
        try:
            from wordfreq import top_n_list
            words = top_n_list(lang, 200_000)
            # rank 1 = most frequent; .lower() is identity for non-Latin scripts but harmless
            _TOP_RANK_CACHE[lang] = {w.lower(): i + 1 for i, w in enumerate(words)}
        except (LookupError, ValueError, ImportError):
            _TOP_RANK_CACHE[lang] = {}
    return _TOP_RANK_CACHE[lang]


def corpus_freq_rank(lemma: str, lang: str) -> int:
    """Return an integer frequency rank from real corpus data via `wordfreq`.

    Lower = more frequent:  rank 1 ≈ "the"/"的"/"する",  rank 999_999 = unknown.
    Uses positional index from top_n_list (true ordinal) rather than a log formula.
    Supports: en, ja, zh, and 40+ other languages.
    """
    rank_map = _load_top_rank(lang)
    return rank_map.get(lemma.lower(), DEFAULT_FREQUENCY_RANK)


def chunks(rows: list[WordRow], size: int = BATCH_SIZE) -> Iterable[list[WordRow]]:
    for idx in range(0, len(rows), size):
        yield rows[idx : idx + size]


async def connect():
    if asyncpg is None:
        raise RuntimeError("asyncpg is required for database import; install pyproject dependencies")
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required for database import")
    return await asyncpg.connect(database_url)


async def bulk_insert_words(conn, rows: list[WordRow]) -> dict[tuple[str, str], uuid.UUID]:
    if not rows:
        return {}
    await conn.execute("DROP TABLE IF EXISTS tmp_words_import")
    await conn.execute(
        """
        CREATE TEMP TABLE tmp_words_import (
          id uuid,
          language text,
          lemma text,
          reading text,
          pos text,
          ipa text,
          frequency_rank int,
          level text,
          extra jsonb,
          source text,
          source_id text
        ) ON COMMIT DROP
        """
    )
    records = [
        (
            row.id,
            row.language,
            row.lemma,
            row.reading,
            row.pos,
            row.ipa,
            row.frequency_rank,
            row.level,
            json.dumps(row.extra, ensure_ascii=False),
            row.source or None,
            row.source_id or None,
        )
        for row in rows
    ]
    await conn.copy_records_to_table("tmp_words_import", records=records)
    imported = await conn.fetch(
        """
        INSERT INTO words (id, language, lemma, reading, pos, ipa, frequency_rank, level, extra, source, source_id)
        SELECT DISTINCT ON (language, lemma, pos)
               id, language, lemma, reading, pos, ipa, frequency_rank, level, extra, source, source_id
        FROM tmp_words_import
        ORDER BY language, lemma, pos, frequency_rank ASC
        ON CONFLICT (language, lemma, pos) DO UPDATE SET
          reading = EXCLUDED.reading,
          ipa = EXCLUDED.ipa,
          frequency_rank = LEAST(words.frequency_rank, EXCLUDED.frequency_rank),
          level = COALESCE(NULLIF(EXCLUDED.level, ''), words.level),
          extra = words.extra || EXCLUDED.extra,
          source = COALESCE(EXCLUDED.source, words.source),
          source_id = COALESCE(EXCLUDED.source_id, words.source_id),
          updated_at = now()
        RETURNING id, language, lemma, pos
        """
    )
    return {(r["language"], r["lemma"], r["pos"]): r["id"] for r in imported}


async def bulk_insert_meanings(conn, word_id_map: dict[tuple[str, str, str], uuid.UUID], rows: list[WordRow]) -> None:
    records = []
    for row in rows:
        word_id = word_id_map.get((row.language, row.lemma, row.pos))
        if not word_id:
            continue
        for ui_language, meaning, order_idx in row.meanings:
            records.append((uuid.uuid4(), word_id, ui_language, meaning, order_idx))
    if records:
        await conn.execute("DROP TABLE IF EXISTS tmp_word_meanings_import")
        await conn.execute(
            """
            CREATE TEMP TABLE tmp_word_meanings_import (
              id uuid,
              word_id uuid,
              ui_language text,
              meaning text,
              order_idx int
            ) ON COMMIT DROP
            """
        )
        await conn.copy_records_to_table("tmp_word_meanings_import", records=records)
        await conn.execute(
            """
            INSERT INTO word_meanings (id, word_id, ui_language, meaning, order_idx)
            SELECT id, word_id, ui_language, meaning, order_idx
            FROM tmp_word_meanings_import t
            WHERE NOT EXISTS (
              SELECT 1 FROM word_meanings m
              WHERE m.word_id = t.word_id
                AND m.ui_language = t.ui_language
                AND m.meaning = t.meaning
            )
            """
        )


async def import_rows(rows: list[WordRow]) -> None:
    conn = await connect()
    try:
        async with conn.transaction():
            for batch in chunks(rows):
                word_ids = await bulk_insert_words(conn, batch)
                await bulk_insert_meanings(conn, word_ids, batch)
    finally:
        await conn.close()


def run_import(rows: list[WordRow]) -> None:
    asyncio.run(import_rows(rows))

from __future__ import annotations

import argparse
import asyncio
import json
import os
from dataclasses import dataclass, field
from typing import Any

try:
    import asyncpg
except ImportError:  # pragma: no cover
    asyncpg = None


@dataclass(slots=True)
class VocabEntry:
    id: str
    language: str
    lemma: str
    reading: str = ""
    pos: str = ""
    ipa: str = ""
    frequency_rank: int | None = None
    level: str = ""
    extra: dict[str, Any] = field(default_factory=dict)
    meanings: list[str] = field(default_factory=list)


def _database_url() -> str:
    database_url = os.environ.get("VOCAB_DATABASE_URL") or os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError("VOCAB_DATABASE_URL or DATABASE_URL is required")
    return database_url


async def connect():
    if asyncpg is None:
        raise RuntimeError("asyncpg is required; install pyproject dependencies")
    return await asyncpg.connect(_database_url())


async def fetch_vocab_entries(
    lemmas: list[str],
    language: str = "en",
    ui_language: str = "vi",
) -> list[VocabEntry]:
    clean_lemmas = [lemma.strip() for lemma in lemmas if lemma.strip()]
    if not clean_lemmas:
        return []

    conn = await connect()
    try:
        rows = await conn.fetch(
            """
            SELECT w.id::text,
                   w.language,
                   w.lemma,
                   COALESCE(w.reading, '') AS reading,
                   COALESCE(w.pos, '') AS pos,
                   COALESCE(w.ipa, '') AS ipa,
                   w.frequency_rank,
                   COALESCE(w.level, '') AS level,
                   COALESCE(w.extra, '{}'::jsonb) AS extra,
                   COALESCE(array_agg(wm.meaning ORDER BY wm.order_idx)
                     FILTER (WHERE wm.meaning IS NOT NULL), '{}') AS meanings
            FROM words w
            LEFT JOIN word_meanings wm
              ON wm.word_id = w.id AND wm.ui_language = $3
            WHERE w.language = $1 AND lower(w.lemma) = ANY($2::text[])
            GROUP BY w.id, w.language, w.lemma, w.reading, w.pos, w.ipa,
                     w.frequency_rank, w.level, w.extra
            ORDER BY w.frequency_rank ASC NULLS LAST, w.lemma ASC
            """,
            language,
            [lemma.lower() for lemma in clean_lemmas],
            ui_language,
        )
    finally:
        await conn.close()

    return [
        VocabEntry(
            id=row["id"],
            language=row["language"],
            lemma=row["lemma"],
            reading=row["reading"],
            pos=row["pos"],
            ipa=row["ipa"],
            frequency_rank=row["frequency_rank"],
            level=row["level"],
            extra=dict(row["extra"] or {}),
            meanings=list(row["meanings"] or []),
        )
        for row in rows
    ]


async def _main() -> None:
    parser = argparse.ArgumentParser(description="Query vocabulary words table")
    parser.add_argument("--lemma", action="append", required=True)
    parser.add_argument("--language", default="en")
    parser.add_argument("--ui-language", default="vi")
    args = parser.parse_args()
    entries = await fetch_vocab_entries(args.lemma, args.language, args.ui_language)
    print(json.dumps([entry.__dict__ for entry in entries], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    asyncio.run(_main())

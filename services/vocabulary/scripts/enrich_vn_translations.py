from __future__ import annotations

import argparse
import asyncio
import json
import os

from common import connect


PROMPT = """Translate these English meanings of a Japanese/Chinese word to natural Vietnamese.
Return JSON only: {"vi": ["...", "..."]}.
Word: {lemma}
English meanings: {meanings_en}
"""


async def fetch_candidates(conn, limit: int) -> list[dict]:
    rows = await conn.fetch(
        """
        SELECT w.id, w.language, w.lemma, array_agg(m.meaning ORDER BY m.order_idx) AS meanings_en
        FROM words w
        JOIN word_meanings m ON m.word_id = w.id AND m.ui_language = 'en'
        WHERE w.language = ANY($1::text[])
          AND NOT EXISTS (
            SELECT 1 FROM word_meanings vm WHERE vm.word_id = w.id AND vm.ui_language = 'vi'
          )
        GROUP BY w.id
        ORDER BY w.frequency_rank ASC
        LIMIT $2
        """,
        ["ja", "zh"],
        limit,
    )
    return [dict(r) for r in rows]


async def translate_batch(client, rows: list[dict]) -> list[tuple[str, list[str]]]:
    prompt = "\n\n".join(
        PROMPT.format(lemma=row["lemma"], meanings_en=json.dumps(row["meanings_en"], ensure_ascii=False))
        for row in rows
    )
    msg = await client.messages.create(
        model=os.environ.get("ANTHROPIC_MODEL", "claude-3-haiku-20240307"),
        max_tokens=1_000,
        messages=[{"role": "user", "content": prompt}],
    )
    payload = json.loads(msg.content[0].text)
    if isinstance(payload, dict) and "items" in payload:
        return [(row["id"], item.get("vi", [])) for row, item in zip(rows, payload["items"])]
    return [(rows[0]["id"], payload.get("vi", []))]


async def insert_vi(conn, word_id: str, meanings: list[str]) -> None:
    for idx, meaning in enumerate(meanings):
        if meaning.strip():
            await conn.execute(
                "INSERT INTO word_meanings (word_id, ui_language, meaning, order_idx) VALUES ($1, 'vi', $2, $3)",
                word_id,
                meaning.strip(),
                idx,
            )


async def main_async(limit: int, dry_run: bool) -> None:
    from anthropic import AsyncAnthropic

    conn = await connect()
    try:
        rows = await fetch_candidates(conn, limit)
        print(f"enrich: found {len(rows)} candidates")
        if dry_run or not rows:
            return
        client = AsyncAnthropic()
        for idx in range(0, len(rows), 10):
            translated = await translate_batch(client, rows[idx : idx + 10])
            for word_id, meanings in translated:
                await insert_vi(conn, word_id, meanings)
    finally:
        await conn.close()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=10_000)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    asyncio.run(main_async(args.limit, args.dry_run))


if __name__ == "__main__":
    main()

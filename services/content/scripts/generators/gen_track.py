"""generators/gen_track.py — Generate all lessons for an entire track.

Usage:
    python -m generators.gen_track --track english_a1_for_vi
    python -m generators.gen_track ... --no-llm
    python -m generators.gen_track ... --dry-run
    python -m generators.gen_track ... --concurrency 2   # conservative for free-tier

Rate limit note (Gemini free tier: 15 req/min):
    1 lesson = ~6 LLM calls.  concurrency=2 → ~12 calls/min → safe.
    concurrency=3 → ~18 calls/min → may hit rate limit.
    Use --concurrency 2 for safe free-tier usage.
"""
from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path
from typing import Any

import yaml

from common.lesson_factory import build_lesson
from common.llm_client import GeminiClient, client_from_env
from common.vocab_query import fetch_vocab_entries
from generators.validator import validate_generated_lesson


ROOT = Path(__file__).resolve().parents[1]


def _load_track(track_id: str) -> dict[str, Any]:
    path = ROOT / "tracks" / f"{track_id}.yaml"
    if not path.exists():
        raise FileNotFoundError(path)
    return yaml.safe_load(path.read_text(encoding="utf-8"))


async def _generate_one(
    lesson_cfg: dict,
    unit: dict,
    track: dict,
    entries: list,
    client: GeminiClient | None,
    out_dir: Path,
    sem: asyncio.Semaphore,
) -> tuple[str, str | None, str | None]:
    """Generate a single lesson. Returns (path_str_or_none, error_or_none)."""
    lesson_id = lesson_cfg["id"]
    unit_id = unit["id"]
    out_path = out_dir / f"{unit_id}_{lesson_id}.draft.json"

    async with sem:
        try:
            generated = await build_lesson(
                client=client,
                track_id=track["id"],
                unit_id=unit_id,
                lesson_config=lesson_cfg,
                entries=entries,
                language=track.get("source_lang", "en"),
                ui_language=track.get("ui_lang", "vi"),
                level=str(track.get("cefr_level", "A1")),
            )
            validated = validate_generated_lesson(generated.model_dump(mode="json"))
            out_path.write_text(
                json.dumps(validated.model_dump(mode="json", exclude_none=True), ensure_ascii=False, indent=2),
                encoding="utf-8",
            )
            rel = str(out_path.relative_to(ROOT))
            mode = "llm" if client is not None else "rule"
            print(f"  ✓ [{mode}] {rel}")
            return rel, None
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            print(f"  ✗  SKIP '{lesson_id}': {msg}")
            return None, msg


async def generate_track(
    track_id: str,
    *,
    use_llm: bool = True,
    dry_run: bool = False,
    concurrency: int = 2,
) -> dict[str, Any]:
    config = _load_track(track_id)
    track = config["track"]
    units = config.get("units", [])

    if not units:
        print(f"[gen-track] '{track_id}' has no units.")
        return {"track": track_id, "units": [], "summary": {"generated": 0, "skipped": 0}}

    # Single LLM client shared across ALL units in the track
    client = None
    if use_llm:
        client = client_from_env(dry_run=dry_run)
        if client is None and not dry_run:
            print("[gen-track] GEMINI_API_KEY not set — using rule-based for whole track.")

    # One DB round-trip for all words in the track
    all_words = list(dict.fromkeys(
        str(w)
        for unit in units
        for lc in unit.get("lessons", [])
        for w in lc.get("target_words", [])
    ))
    try:
        entries = await fetch_vocab_entries(
            all_words,
            language=track.get("source_lang", "en"),
            ui_language=track.get("ui_lang", "vi"),
        )
        print(f"[gen-track] fetched {len(entries)} vocab entries for {len(all_words)} unique words")
    except Exception as exc:  # noqa: BLE001
        print(f"[gen-track] vocab DB unavailable ({exc}) — using fallback meanings")
        entries = []

    out_dir = ROOT / "drafts" / track_id
    out_dir.mkdir(parents=True, exist_ok=True)

    mode_label = "LLM" if client is not None else "rule-based"
    total_lessons = sum(len(u.get("lessons", [])) for u in units)
    print(f"[gen-track] track '{track_id}' — {len(units)} units, {total_lessons} lessons [{mode_label}]")

    # Semaphore controls concurrency across ALL units (not per-unit)
    sem = asyncio.Semaphore(concurrency)

    report: dict[str, Any] = {"track": track_id, "units": []}
    total_ok = 0
    total_skip = 0

    for unit in units:
        unit_id = unit["id"]
        lessons = unit.get("lessons", [])
        print(f"\n  unit '{unit_id}' — {len(lessons)} lesson(s)")

        tasks = [
            _generate_one(lc, unit, track, entries, client, out_dir, sem)
            for lc in lessons
        ]
        results = await asyncio.gather(*tasks)

        unit_generated = [p for p, e in results if p is not None]
        unit_skipped = [{"lesson": lc["id"], "error": e} for (p, e), lc in zip(results, lessons) if e]

        total_ok += len(unit_generated)
        total_skip += len(unit_skipped)
        report["units"].append({
            "unit": unit_id,
            "title": unit.get("title", unit_id),
            "generated": unit_generated,
            "skipped": unit_skipped,
        })

    report["summary"] = {"generated": total_ok, "skipped": total_skip}
    print(f"\n[gen-track] DONE — {total_ok} generated, {total_skip} skipped")
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate all lessons for an entire track")
    parser.add_argument("--track", required=True)
    parser.add_argument("--no-llm", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument(
        "--concurrency", type=int, default=2,
        help="Max concurrent Gemini calls across the track (default 2 — safe for free tier)",
    )
    args = parser.parse_args()
    report = asyncio.run(generate_track(
        args.track,
        use_llm=not args.no_llm,
        dry_run=args.dry_run,
        concurrency=args.concurrency,
    ))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

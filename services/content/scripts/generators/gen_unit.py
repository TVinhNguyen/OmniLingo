"""generators/gen_unit.py — Generate all lessons in a unit.

Usage:
    python -m generators.gen_unit --track english_a1_for_vi --unit greetings
    python -m generators.gen_unit ... --no-llm      # rule-based only
    python -m generators.gen_unit ... --dry-run     # LLM dry-run (no API calls)
    python -m generators.gen_unit ... --concurrency 2
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


def _find_unit(config: dict[str, Any], unit_id: str) -> dict[str, Any]:
    for unit in config.get("units", []):
        if unit.get("id") == unit_id:
            return unit
    raise ValueError(f"unit not found: {unit_id!r}")


async def _generate_one(
    lesson_cfg: dict,
    unit: dict,
    track: dict,
    entries: list,
    client: GeminiClient | None,
    out_dir: Path,
    sem: asyncio.Semaphore,
) -> tuple[str, Path | None, str | None]:
    """Generate a single lesson. Returns (lesson_id, path_or_none, error_or_none)."""
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
            mode = "llm" if client is not None else "rule"
            print(f"  ✓ [{mode}] {out_path.relative_to(ROOT)}")
            return lesson_id, out_path, None
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            print(f"  ✗  SKIP '{lesson_id}': {msg}")
            return lesson_id, None, msg


async def generate_unit(
    track_id: str,
    unit_id: str,
    *,
    use_llm: bool = True,
    dry_run: bool = False,
    concurrency: int = 3,
) -> list[Path]:
    config = _load_track(track_id)
    track = config["track"]
    unit = _find_unit(config, unit_id)
    lessons = unit.get("lessons", [])

    if not lessons:
        print(f"[gen-unit] unit '{unit_id}' has no lessons.")
        return []

    # Single LLM client for the whole unit
    client = None
    if use_llm:
        client = client_from_env(dry_run=dry_run)
        if client is None and not dry_run:
            print("[gen-unit] GEMINI_API_KEY not set — using rule-based for all lessons.")

    # Batch vocab fetch
    all_words = list(dict.fromkeys(
        str(w) for lc in lessons for w in lc.get("target_words", [])
    ))
    try:
        entries = await fetch_vocab_entries(
            all_words,
            language=track.get("source_lang", "en"),
            ui_language=track.get("ui_lang", "vi"),
        )
        print(f"[gen-unit] fetched {len(entries)} vocab entries")
    except Exception as exc:  # noqa: BLE001
        print(f"[gen-unit] vocab DB unavailable ({exc}) — using fallback meanings")
        entries = []

    out_dir = ROOT / "drafts" / track_id
    out_dir.mkdir(parents=True, exist_ok=True)

    mode_label = "LLM" if client is not None else "rule-based"
    print(f"[gen-unit] unit '{unit_id}' — {len(lessons)} lesson(s) [{mode_label}]")

    sem = asyncio.Semaphore(concurrency)
    tasks = [
        _generate_one(lc, unit, track, entries, client, out_dir, sem)
        for lc in lessons
    ]
    results = await asyncio.gather(*tasks)

    written = [p for _, p, e in results if p is not None]
    errors = [(lid, e) for lid, _, e in results if e is not None]
    print(f"\n[gen-unit] {unit_id}: {len(written)} generated, {len(errors)} skipped")
    if errors:
        for lid, err in errors:
            print(f"  ✗ {lid}: {err}")
    return written


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate all lessons in a unit")
    parser.add_argument("--track", required=True)
    parser.add_argument("--unit", required=True)
    parser.add_argument("--no-llm", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--concurrency", type=int, default=3,
                        help="Max concurrent Gemini calls per unit (default 3)")
    args = parser.parse_args()
    paths = asyncio.run(generate_unit(
        args.track, args.unit,
        use_llm=not args.no_llm,
        dry_run=args.dry_run,
        concurrency=args.concurrency,
    ))
    print(json.dumps({"generated": [str(p) for p in paths]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

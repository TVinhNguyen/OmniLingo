"""generators/skeleton.py — Generate a single lesson draft.

Usage:
    python -m generators.skeleton --track english_a1_for_vi --unit greetings --lesson hello_basics
    python -m generators.skeleton ... --no-llm     # force rule-based (no Gemini)
    python -m generators.skeleton ... --dry-run    # dry-run LLM (no API calls)
"""
from __future__ import annotations

import argparse
import asyncio
import json
import os
from pathlib import Path
from typing import Any

import yaml

from common.lesson_factory import build_lesson
from common.llm_client import client_from_env
from common.vocab_query import fetch_vocab_entries
from generators.validator import validate_generated_lesson


ROOT = Path(__file__).resolve().parents[1]


def _load_track(track_id: str) -> dict[str, Any]:
    path = ROOT / "tracks" / f"{track_id}.yaml"
    if not path.exists():
        raise FileNotFoundError(path)
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def _find_lesson(config: dict[str, Any], unit_id: str, lesson_id: str) -> tuple[dict[str, Any], dict[str, Any]]:
    for unit in config.get("units", []):
        if unit.get("id") != unit_id:
            continue
        for lesson in unit.get("lessons", []):
            if lesson.get("id") == lesson_id:
                return unit, lesson
    raise ValueError(f"lesson not found: unit={unit_id} lesson={lesson_id}")


async def generate(
    track_id: str,
    unit_id: str,
    lesson_id: str,
    *,
    use_llm: bool = True,
    dry_run: bool = False,
) -> Path:
    config = _load_track(track_id)
    track = config["track"]
    unit, lesson_config = _find_lesson(config, unit_id, lesson_id)
    target_words = [str(word) for word in lesson_config.get("target_words", [])]

    # Vocab lookup (best-effort — fall through on any DB error)
    try:
        entries = await fetch_vocab_entries(
            target_words,
            language=track.get("source_lang", "en"),
            ui_language=track.get("ui_lang", "vi"),
        )
    except Exception as exc:  # noqa: BLE001
        import warnings
        warnings.warn(
            f"vocab DB unavailable ({type(exc).__name__}: {exc}) — using fallback meanings",
            stacklevel=2,
        )
        entries = []

    # LLM client — None disables LLM and routes to rule-based
    llm_client = None
    if use_llm:
        llm_client = client_from_env(dry_run=dry_run)
        if llm_client is None and not dry_run:
            print(
                "[skeleton] GEMINI_API_KEY not set — falling back to rule-based generation.\n"
                "           Set GEMINI_API_KEY or use --no-llm to silence this message."
            )

    generated = await build_lesson(
        client=llm_client,
        track_id=track["id"],
        unit_id=unit["id"],
        lesson_config=lesson_config,
        entries=entries,
        language=track.get("source_lang", "en"),
        ui_language=track.get("ui_lang", "vi"),
        level=str(track.get("cefr_level", "A1")),
    )
    validated = validate_generated_lesson(generated.model_dump(mode="json"))

    out_dir = ROOT / "drafts" / track_id
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{unit_id}_{lesson_id}.draft.json"
    out_path.write_text(
        json.dumps(validated.model_dump(mode="json", exclude_none=True), ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    mode_tag = "llm" if (llm_client is not None) else "rule-based"
    print(f"[{mode_tag}] wrote {out_path}")
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a lesson draft (LLM or rule-based)")
    parser.add_argument("--track", required=True)
    parser.add_argument("--unit", required=True)
    parser.add_argument("--lesson", required=True)
    parser.add_argument(
        "--no-llm", action="store_true",
        help="Skip Gemini and use rule-based generation (fast, deterministic)",
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Use LLM client in dry-run mode (no real API calls, for pipeline testing)",
    )
    args = parser.parse_args()
    path = asyncio.run(generate(
        args.track, args.unit, args.lesson,
        use_llm=not args.no_llm,
        dry_run=args.dry_run,
    ))
    print(f"wrote {path}")


if __name__ == "__main__":
    main()

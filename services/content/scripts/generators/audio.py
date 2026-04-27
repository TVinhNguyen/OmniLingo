from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path
from typing import Any

import yaml

from common.tts_client import synthesize_to_local_cache


ROOT = Path(__file__).resolve().parents[1]


def _load_track(track_id: str) -> dict[str, Any]:
    path = ROOT / "tracks" / f"{track_id}.yaml"
    if not path.exists():
        raise FileNotFoundError(path)
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def _collect_texts(data: dict[str, Any]) -> list[str]:
    texts: list[str] = []
    for exercise in data.get("exercises", []):
        reference = exercise.get("referenceText")
        if reference:
            texts.append(reference)
        prompt_text = exercise.get("prompt", {}).get("text", {})
        if isinstance(prompt_text, dict):
            for value in prompt_text.values():
                if isinstance(value, str) and value.strip() and "___" not in value:
                    texts.append(value)
    seen: set[str] = set()
    unique: list[str] = []
    for text in texts:
        if text not in seen:
            unique.append(text)
            seen.add(text)
    return unique


async def attach_audio(path: Path, track_id: str, *, dry_run: bool = False) -> Path:
    data = json.loads(path.read_text(encoding="utf-8"))
    track = _load_track(track_id)
    language = track["track"].get("source_lang", "en")
    voice_id = track.get("voice", {}).get("primary")
    if not voice_id:
        raise RuntimeError(f"voice.primary is required in track config {track_id}")

    texts = _collect_texts(data)
    if not texts:
        print("[audio] no synthesisable texts found in lesson — nothing to do")
        out_path = path.with_suffix(".audio.json")
        out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        return out_path

    cache_dir = ROOT / "audio-cache"
    audio_refs: dict[str, str] = {}

    print(f"[audio] synthesising {len(texts)} text(s) for lesson: {path.name}")
    for text in texts:
        audio_path = await synthesize_to_local_cache(
            text, voice_id, language, cache_dir, dry_run=dry_run
        )
        audio_refs[text] = str(audio_path.relative_to(ROOT))
        print(f"  ✓  {text!r:<40} → {audio_refs[text]}")

    for exercise in data.get("exercises", []):
        reference = exercise.get("referenceText")
        if reference and reference in audio_refs:
            exercise.setdefault("prompt", {})["audioRef"] = audio_refs[reference]

    out_path = path.with_suffix(".audio.json")
    out_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[audio] wrote {out_path}")
    return out_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Attach ElevenLabs audio refs to generated lesson")
    parser.add_argument("path", type=Path)
    parser.add_argument("--track", required=True)
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Skip actual ElevenLabs API call — useful for smoke-testing the pipeline without spending credits",
    )
    args = parser.parse_args()
    out_path = asyncio.run(attach_audio(args.path, args.track, dry_run=args.dry_run))
    print(f"wrote {out_path}")


if __name__ == "__main__":
    main()

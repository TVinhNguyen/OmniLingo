from __future__ import annotations

import argparse
import asyncio
import json
import warnings
from pathlib import Path

from common.content_api import create_exercise, create_lesson, get_lesson_by_source, publish_lesson
from common.schema import GeneratedLesson
from generators.validator import validate_generated_lesson


def _check_draft_warning(path: Path) -> None:
    """B1: Warn if the caller is trying to publish a raw .draft.json file directly.

    Draft files have not been reviewed/approved yet.  The approved workflow is:
    1. Generate  →  *.draft.json
    2. Human review + rename to  *.approved.json  (or *.audio.json after audio pipeline)
    3. Publish  *.approved.json  (or *.audio.json)

    We do NOT block — maybe the operator knows what they're doing — but we do emit a
    clear warning so CI logs surface the issue.
    """
    name = path.name
    if ".draft." in name:
        warnings.warn(
            f"[B1] Publishing a raw draft file: '{path}'.  "
            "Draft files have NOT been human-reviewed.  "
            "Rename to *.approved.json (or run the audio pipeline first) before publishing.",
            stacklevel=3,
        )


async def _check_remote_idempotency(source_key: str) -> dict | None:
    """B2: Ask content-service whether this source has already been published.

    Returns the existing lesson dict if found, else None.
    We key on the canonical source path so re-running publish.py for the same
    file is a no-op at the API level (not just at the local *.published.json level).
    """
    try:
        return await get_lesson_by_source(source_key)
    except Exception:
        # If the endpoint is unavailable or returns an unexpected error we fall
        # through and let the normal publish flow handle it (may get a 409 from
        # the API which will propagate as an httpx error).
        return None


async def publish_file(path: Path, publish: bool = False, force: bool = False) -> dict:
    # B1 — warn on raw draft files
    _check_draft_warning(path)

    published_path = path.with_suffix(".published.json")

    # Local idempotency gate (fast path)
    if published_path.exists() and not force:
        existing = json.loads(published_path.read_text(encoding="utf-8"))
        print(f"skip: already published (local cache) → {published_path}")
        return {"published_path": str(published_path), "lesson": existing.get("lesson", {})}

    data = json.loads(path.read_text(encoding="utf-8"))
    generated = validate_generated_lesson(data)

    # B2 — remote idempotency gate
    # Use a stable source key derived from the relative path so it survives
    # volume remounts inside Docker.
    source_key = f"{path.parent.name}/{path.name}"  # include track dir to avoid cross-track collision
    if not force:
        existing_remote = await _check_remote_idempotency(source_key)
        if existing_remote:
            lesson_id = existing_remote.get("id") or existing_remote.get("lesson", {}).get("id")
            print(
                f"skip: lesson '{source_key}' already exists in content-service "
                f"(id={lesson_id}).  Use --force to re-publish."
            )
            # Persist a local cache entry so next run hits the fast path
            if not published_path.exists():
                published_path.write_text(
                    json.dumps(
                        {
                            "source": str(path),
                            "skipped": True,
                            "remote_lesson": existing_remote,
                            "lesson": existing_remote,
                        },
                        ensure_ascii=False,
                        indent=2,
                    ),
                    encoding="utf-8",
                )
            return {"published_path": str(published_path), "lesson": existing_remote}

    exercise_id_map: dict[str, str] = {}

    for exercise in generated.exercises:
        response = await create_exercise(exercise)
        created = response.get("exercise", response)
        new_id = created.get("id")
        if not new_id:
            raise RuntimeError(f"content-service did not return exercise id for {exercise.id}")
        exercise_id_map[exercise.id] = new_id

    lesson_payload = generated.lesson.model_copy(deep=True)
    for block in lesson_payload.blocks:
        if block.exerciseId and block.exerciseId in exercise_id_map:
            block.exerciseId = exercise_id_map[block.exerciseId]

    lesson_response = await create_lesson(lesson_payload, source_key=source_key)
    created_lesson = lesson_response.get("lesson", lesson_response)
    lesson_id = created_lesson.get("id")
    if publish:
        if not lesson_id:
            raise RuntimeError("content-service did not return lesson id")
        lesson_response = await publish_lesson(lesson_id)

    published_path.write_text(
        json.dumps(
            {
                "source": str(path),
                "exercise_id_map": exercise_id_map,
                "lesson": lesson_response,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    return {"published_path": str(published_path), "lesson": lesson_response}


def main() -> None:
    parser = argparse.ArgumentParser(description="Publish an approved generated lesson")
    parser.add_argument("path", type=Path)
    parser.add_argument("--publish", action="store_true")
    parser.add_argument("--force", action="store_true", help="Re-publish even if .published.json exists or remote record found")
    args = parser.parse_args()
    result = asyncio.run(publish_file(args.path, publish=args.publish, force=args.force))
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

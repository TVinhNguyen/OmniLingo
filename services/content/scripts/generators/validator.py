from __future__ import annotations

import argparse
import json
from pathlib import Path

from common.schema import GeneratedLesson


BLOCKED_TERMS = {"politics", "religion", "violence", "hate"}


def validate_generated_lesson(data: dict) -> GeneratedLesson:
    generated = GeneratedLesson.model_validate(data)
    exercise_ids = {exercise.id for exercise in generated.exercises}
    missing = [
        block.exerciseId
        for block in generated.lesson.blocks
        if block.exerciseId and block.exerciseId not in exercise_ids
    ]
    if missing:
        raise ValueError(f"lesson references missing exercises: {missing}")
    for exercise in generated.exercises:
        if exercise.answer in (None, "", [], {}):
            raise ValueError(f"exercise {exercise.id} has empty answer")
    serialized = json.dumps(data, ensure_ascii=False).lower()
    blocked = sorted(term for term in BLOCKED_TERMS if term in serialized)
    if blocked:
        raise ValueError(f"blocked terms found: {blocked}")
    return generated


def main() -> None:
    parser = argparse.ArgumentParser(description="Validate generated lesson JSON")
    parser.add_argument("path", type=Path)
    args = parser.parse_args()
    data = json.loads(args.path.read_text(encoding="utf-8"))
    validate_generated_lesson(data)
    print(f"valid: {args.path}")


if __name__ == "__main__":
    main()

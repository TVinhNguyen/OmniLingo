from __future__ import annotations

from datetime import datetime
from enum import StrEnum
from typing import Any, Literal

from pydantic import BaseModel, Field, HttpUrl, model_validator


class LessonBlockType(StrEnum):
    EXPLANATION = "explanation"
    VOCAB_INTRO = "vocab_intro"
    EXERCISE = "exercise"
    DICTATION = "dictation"
    VIDEO = "video"
    READING = "reading"


class LessonStatus(StrEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class DictationSentence(BaseModel):
    text: str
    startMs: int = Field(ge=0)
    endMs: int = Field(ge=0)

    @model_validator(mode="after")
    def validate_time_range(self) -> "DictationSentence":
        if self.endMs < self.startMs:
            raise ValueError("endMs must be greater than or equal to startMs")
        return self


class LessonBlock(BaseModel):
    type: LessonBlockType
    content: dict[str, Any] | None = None
    words: list[str] | None = None
    exerciseId: str | None = None
    audioRef: str | None = None
    sentences: list[DictationSentence] | None = None
    videoRef: str | None = None
    transcript: str | None = None
    passageRef: str | None = None


class Lesson(BaseModel):
    id: str | None = None
    version: int = Field(default=1, ge=1)
    language: str = Field(min_length=2, max_length=5)
    track: str = Field(min_length=1)
    level: str = Field(min_length=1)
    unitId: str = Field(min_length=3)
    title: dict[str, str]
    objective: dict[str, str] = Field(default_factory=dict)
    estimatedMinutes: int = Field(default=10, ge=1, le=120)
    blocks: list[LessonBlock] = Field(default_factory=list)
    thumbnailUrl: HttpUrl | None = None
    status: LessonStatus = LessonStatus.DRAFT
    publishedAt: datetime | None = None
    createdBy: str | None = None
    updatedBy: str | None = None


class CreateLessonPayload(BaseModel):
    language: str = Field(min_length=2, max_length=5)
    track: str = Field(min_length=1)
    level: str = Field(min_length=1)
    unitId: str = Field(min_length=3)
    title: dict[str, str]
    objective: dict[str, str] = Field(default_factory=dict)
    estimatedMinutes: int = Field(default=10, ge=1, le=120)
    blocks: list[LessonBlock] = Field(default_factory=list)
    thumbnailUrl: HttpUrl | None = None


class ExerciseType(StrEnum):
    MULTIPLE_CHOICE = "multiple_choice"
    FILL_IN_BLANK = "fill_in_blank"
    MATCHING = "matching"
    DICTATION = "dictation"
    SENTENCE_ARRANGE = "sentence_arrange"
    TRANSLATION = "translation"
    SPEAKING_PROMPT = "speaking_prompt"


class Exercise(BaseModel):
    id: str
    type: ExerciseType
    language: str = Field(min_length=2, max_length=5)
    level: str = Field(min_length=1)
    skill: Literal["vocabulary", "grammar", "listening", "speaking", "reading", "writing"] = "vocabulary"
    prompt: dict[str, Any] = Field(default_factory=dict)
    choices: list[str] | None = None
    answer: int | str | list[str] | None = None
    referenceText: str | None = None
    lengthSeconds: int | None = None
    durationSeconds: int | None = None
    rubricCode: str | None = None
    pairs: list[dict[str, str]] | None = None
    explanation: dict[str, str] = Field(default_factory=dict)
    tags: list[str] = Field(default_factory=list)
    difficulty: float = Field(default=0.5, ge=0, le=1)


class GeneratedLesson(BaseModel):
    lesson: CreateLessonPayload
    exercises: list[Exercise] = Field(default_factory=list)


def main() -> None:
    print(Lesson.model_json_schema())


if __name__ == "__main__":
    main()

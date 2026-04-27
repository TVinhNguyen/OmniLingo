from __future__ import annotations

import os
from typing import Any

import httpx

from common.schema import CreateLessonPayload, Exercise


def _base_url() -> str:
    return os.environ.get("CONTENT_SERVICE_URL", "http://localhost:8080").rstrip("/")


def _headers() -> dict[str, str]:
    headers = {"Content-Type": "application/json"}
    token = os.environ.get("CONTENT_ADMIN_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def get_lesson_by_source(source_key: str) -> dict[str, Any] | None:
    """B2: Check whether a lesson with the given source key already exists.

    content-service exposes GET /api/v1/content/lessons?sourceKey=<key>.
    Returns the lesson dict on a 200 hit, None on 404 or if the endpoint is
    not available (so the caller can decide whether to proceed).
    """
    async with httpx.AsyncClient(base_url=_base_url(), timeout=10) as client:
        try:
            response = await client.get(
                "/api/v1/content/lessons",
                params={"sourceKey": source_key},
                headers=_headers(),
            )
            if response.status_code == 404:
                return None
            response.raise_for_status()
            body = response.json()
            # Support both {lesson: {...}} and [...] response shapes
            if isinstance(body, list):
                return body[0] if body else None
            lessons = body.get("lessons") or body.get("data")
            if isinstance(lessons, list):
                return lessons[0] if lessons else None
            return body.get("lesson") or (body if "id" in body else None)
        except (httpx.ConnectError, httpx.TimeoutException):
            # content-service not reachable — don't block publish
            return None


async def create_lesson(payload: CreateLessonPayload, *, source_key: str | None = None) -> dict[str, Any]:
    body = payload.model_dump(mode="json", exclude_none=True)
    if source_key:
        body["sourceKey"] = source_key
    async with httpx.AsyncClient(base_url=_base_url(), timeout=30) as client:
        response = await client.post(
            "/api/v1/content/lessons",
            json=body,
            headers=_headers(),
        )
        response.raise_for_status()
        return response.json()


async def create_exercise(payload: Exercise) -> dict[str, Any]:
    data = payload.model_dump(mode="json", exclude_none=True)
    data.pop("id", None)
    async with httpx.AsyncClient(base_url=_base_url(), timeout=30) as client:
        response = await client.post(
            "/api/v1/content/exercises",
            json=data,
            headers=_headers(),
        )
        response.raise_for_status()
        return response.json()


async def publish_lesson(lesson_id: str) -> dict[str, Any]:
    # Publish is a state-transition — no request body needed.
    # Only send Authorization header to avoid "Body cannot be empty" errors.
    headers = {}
    token = os.environ.get("CONTENT_ADMIN_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    async with httpx.AsyncClient(base_url=_base_url(), timeout=30) as client:
        response = await client.post(
            f"/api/v1/content/lessons/{lesson_id}/publish",
            headers=headers,
        )
        response.raise_for_status()
        return response.json()

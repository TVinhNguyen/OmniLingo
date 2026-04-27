"""common/llm_client.py — Async Gemini 2.0 Flash wrapper for lesson generation.

Usage:
    client = GeminiClient()                    # reads GEMINI_API_KEY from env
    result = await client.generate_json(
        prompt="...",
        schema=MyPydanticModel,
    )

Dry-run mode (no API calls, test pipeline only):
    client = GeminiClient(dry_run=True)
    result = await client.generate_json(...)   # returns fixture / empty model

Rate-limit handling:
    - Retries up to MAX_RETRIES times with exponential backoff
    - 429 → wait 2^attempt seconds
    - 503 → same strategy
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import time
from typing import Any, TypeVar

try:
    from google import genai
    from google.genai import types as genai_types
    _GENAI_AVAILABLE = True
except ImportError:  # pragma: no cover
    _GENAI_AVAILABLE = False

from pydantic import BaseModel


log = logging.getLogger(__name__)

T = TypeVar("T", bound=BaseModel)

_DEFAULT_MODEL = "gemini-2.0-flash"
_MAX_RETRIES = 5
_INITIAL_BACKOFF = 2.0  # seconds
_MAX_BACKOFF = 60.0     # seconds — cap wait for free tier


def _parse_retry_delay(exc_str: str) -> float | None:
    """Extract retryDelay seconds from a 429 error message, e.g. 'retryDelay: 21s'."""
    import re
    m = re.search(r"retryDelay.*?(\d+\.?\d*)s", exc_str)
    if m:
        return min(float(m.group(1)) + 1.0, _MAX_BACKOFF)
    return None



class GeminiClient:
    """Thin async wrapper around google-genai for structured JSON generation."""

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        dry_run: bool = False,
    ) -> None:
        self.dry_run = dry_run
        self.model = model or os.environ.get("GEMINI_MODEL", _DEFAULT_MODEL)

        if dry_run:
            log.info("[llm] dry_run=True — no real Gemini calls will be made")
            self._client = None
            return

        if not _GENAI_AVAILABLE:
            raise RuntimeError(
                "google-genai is not installed. "
                "Run: pip install google-genai>=1.0"
            )

        resolved_key = api_key or os.environ.get("GEMINI_API_KEY")
        if not resolved_key:
            raise RuntimeError(
                "GEMINI_API_KEY is required for LLM-based lesson generation.\n"
                "  Get a free key at https://aistudio.google.com/apikey\n"
                "  Then: export GEMINI_API_KEY=AIza...\n"
                "  Or use --no-llm to fall back to rule-based generation."
            )
        self._client = genai.Client(api_key=resolved_key)

    async def generate_json(
        self,
        prompt: str,
        schema: type[T],
        temperature: float = 0.7,
    ) -> T:
        """Generate structured JSON output conforming to `schema`.

        Args:
            prompt: Full prompt text to send to Gemini.
            schema: Pydantic model class — used both as output schema and
                    for response validation.
            temperature: 0.0 = deterministic, 1.0 = creative. Default 0.7
                         gives varied but coherent educational content.

        Returns:
            A validated instance of `schema`.

        Raises:
            RuntimeError: After MAX_RETRIES exhausted or unrecoverable error.
        """
        if self.dry_run:
            return self._dry_run_fixture(schema)

        last_exc: Exception | None = None
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                t0 = time.monotonic()
                # Run blocking Gemini call in thread pool to keep event loop free
                response = await asyncio.get_event_loop().run_in_executor(
                    None,
                    lambda: self._client.models.generate_content(
                        model=self.model,
                        contents=prompt,
                        config=genai_types.GenerateContentConfig(
                            temperature=temperature,
                            response_mime_type="application/json",
                            response_schema=schema,
                        ),
                    ),
                )
                elapsed = time.monotonic() - t0
                log.debug("[llm] %s generated in %.1fs (attempt %d)", schema.__name__, elapsed, attempt)

                # Parse and validate
                raw = response.text
                data = json.loads(raw)
                return schema.model_validate(data)

            except Exception as exc:  # noqa: BLE001
                last_exc = exc
                exc_str = str(exc).lower()
                is_rate_limit = "429" in exc_str or "quota" in exc_str or "rate" in exc_str
                is_transient = "503" in exc_str or "timeout" in exc_str or "unavailable" in exc_str

                if (is_rate_limit or is_transient) and attempt < _MAX_RETRIES:
                    # Prefer server-provided retryDelay if present in the error message
                    server_delay = _parse_retry_delay(str(exc))
                    wait = server_delay if server_delay is not None else min(_INITIAL_BACKOFF ** attempt, _MAX_BACKOFF)
                    log.warning(
                        "[llm] %s error on attempt %d/%d, retrying in %.0fs: %s",
                        "Rate-limit" if is_rate_limit else "Transient",
                        attempt, _MAX_RETRIES, wait, str(exc)[:120],
                    )
                    await asyncio.sleep(wait)
                    continue

                # Non-retryable or final attempt
                log.error("[llm] Failed after %d attempt(s): %s", attempt, exc)
                raise RuntimeError(
                    f"Gemini generation failed after {attempt} attempt(s): {exc}"
                ) from exc

        raise RuntimeError(f"Gemini generation failed after {_MAX_RETRIES} retries: {last_exc}")

    def _dry_run_fixture(self, schema: type[T]) -> T:
        """Return a minimal valid fixture instance for dry-run mode.

        Iterates model fields and fills them with sensible defaults so the
        downstream lesson builder can inspect structure without hitting the API.
        """
        import typing

        def _make_value(annotation: Any) -> Any:
            origin = getattr(annotation, "__origin__", None)
            args = getattr(annotation, "__args__", ()) or ()

            # Unwrap Optional[X] → X
            if origin is typing.Union:
                non_none = [a for a in args if a is not type(None)]
                if non_none:
                    return _make_value(non_none[0])
                return None

            if annotation is str or annotation == "str":
                return "[dry-run]"
            if annotation is int:
                return 1
            if annotation is float:
                return 0.5
            if annotation is bool:
                return False
            if origin is list:
                inner = args[0] if args else str
                if inner is str:
                    return ["[dry-run-a]", "[dry-run-b]", "[dry-run-c]"]
                if isinstance(inner, type) and issubclass(inner, dict):
                    return [{"left": "hello", "right": "xin chào"}]
                if isinstance(inner, type) and issubclass(inner, BaseModel):
                    return [_make_fixture(inner), _make_fixture(inner)]
                return []
            if origin is dict or annotation is dict:
                return {}
            if isinstance(annotation, type) and issubclass(annotation, BaseModel):
                return _make_fixture(annotation)
            return None

        def _make_fixture(cls: type[T]) -> T:
            fields: dict[str, Any] = {}
            for field_name, field_info in cls.model_fields.items():
                fields[field_name] = _make_value(field_info.annotation)
            try:
                return cls.model_validate(fields)
            except Exception:  # noqa: BLE001
                return cls.model_construct(**fields)

        return _make_fixture(schema)


def client_from_env(dry_run: bool = False) -> GeminiClient | None:
    """Convenience factory — returns None if GEMINI_API_KEY is not set.

    Callers should fall back to rule-based generation when this returns None.
    """
    if dry_run:
        return GeminiClient(dry_run=True)
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        return None
    return GeminiClient(api_key=key)

from __future__ import annotations

import hashlib
import os
from pathlib import Path

import httpx


ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1"
_MAX_RETRIES = 3


class ElevenLabsTTSClient:
    def __init__(self, api_key: str | None = None) -> None:
        self.api_key = api_key or os.environ.get("ELEVENLABS_API_KEY")
        if not self.api_key:
            raise RuntimeError(
                "ELEVENLABS_API_KEY is required.  "
                "Export it in your shell or pass it to the Docker target:\n"
                "  export ELEVENLABS_API_KEY=sk-...\n"
                "  make audio-cache TRACK=... DRAFT_PATH=..."
            )

    async def synthesize(
        self,
        text: str,
        voice_id: str,
        model_id: str = "eleven_multilingual_v2",
    ) -> bytes:
        last_exc: Exception | None = None
        for attempt in range(1, _MAX_RETRIES + 1):
            try:
                async with httpx.AsyncClient(timeout=60) as client:
                    response = await client.post(
                        f"{ELEVENLABS_BASE_URL}/text-to-speech/{voice_id}",
                        headers={
                            "xi-api-key": self.api_key,
                            "Accept": "audio/mpeg",
                            "Content-Type": "application/json",
                        },
                        json={
                            "text": text,
                            "model_id": model_id,
                            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
                        },
                    )
                    if response.status_code == 429:
                        # Rate-limited — retry after a brief wait
                        import asyncio
                        wait = 2 ** attempt
                        print(f"  [tts] rate-limited, retrying in {wait}s (attempt {attempt}/{_MAX_RETRIES})")
                        await asyncio.sleep(wait)
                        last_exc = httpx.HTTPStatusError(
                            f"429 Too Many Requests", request=response.request, response=response
                        )
                        continue
                    response.raise_for_status()
                    return response.content
            except (httpx.ConnectError, httpx.TimeoutException) as exc:
                last_exc = exc
                if attempt < _MAX_RETRIES:
                    import asyncio
                    await asyncio.sleep(2 ** attempt)
                    print(f"  [tts] network error, retrying ({attempt}/{_MAX_RETRIES}): {exc}")
        raise RuntimeError(
            f"ElevenLabs synthesis failed after {_MAX_RETRIES} attempts for text={text!r}: {last_exc}"
        )


def cache_key(text: str, voice_id: str, language: str) -> str:
    digest = hashlib.sha256(f"{language}:{voice_id}:{text}".encode("utf-8")).hexdigest()
    return f"audio/{language}/{voice_id}/{digest}.mp3"


async def synthesize_to_local_cache(
    text: str,
    voice_id: str,
    language: str,
    cache_dir: Path,
    *,
    dry_run: bool = False,
) -> Path:
    """Synthesize `text` via ElevenLabs and cache the mp3 locally.

    Args:
        dry_run: If True, skip the actual API call and return the expected cache
                 path.  Useful for smoke-testing the pipeline without spending
                 API credits (path will NOT exist on disk in this mode).
    """
    key = cache_key(text, voice_id, language)
    target = cache_dir / key
    if target.exists():
        return target
    if dry_run:
        print(f"  [tts dry-run] would synthesize: {text!r} → {target.relative_to(cache_dir)}")
        return target
    target.parent.mkdir(parents=True, exist_ok=True)
    audio = await ElevenLabsTTSClient().synthesize(text, voice_id)
    target.write_bytes(audio)
    return target

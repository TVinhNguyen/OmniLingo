"""
speech-ai-service core: STT, TTS, Pronunciation Assessment.

STT:  Whisper (self-hosted faster-whisper REST) → fallback stub
TTS:  ElevenLabs (premium) | Azure TTS (free/plus) → cached on Redis (hash of text+voice+lang)
Pronunciation: Azure Speech Pronunciation Assessment API (Phase 1)
"""
from __future__ import annotations

import asyncio
import base64
import hashlib
import json
from io import BytesIO
from typing import Optional

import httpx
import redis.asyncio as aioredis

from app.core.config import Settings
from app.schemas.speech import (
    AssessPronunciationRequest,
    AssessPronunciationResponse,
    PhonemeScore,
    SynthesizeRequest,
    SynthesizeResponse,
    TranscribeResponse,
)


class SpeechService:
    def __init__(self, settings: Settings, rdb: aioredis.Redis):
        self.settings = settings
        self.rdb = rdb
        self._http = httpx.AsyncClient(timeout=30.0)

    # ─── STT ────────────────────────────────────────────────────────────────

    async def transcribe(self, audio_bytes: bytes, language: Optional[str] = None) -> TranscribeResponse:
        """
        Transcribe audio using self-hosted Whisper REST API.
        Falls back to stub response if Whisper is unavailable (dev mode).
        """
        if not self.settings.whisper_url:
            return self._stub_transcribe()

        files = {"audio_file": ("audio.webm", BytesIO(audio_bytes), "audio/webm")}
        params = {}
        if language:
            params["language"] = language

        try:
            resp = await self._http.post(
                f"{self.settings.whisper_url}/asr",
                files=files,
                params={**params, "output": "json"},
            )
            resp.raise_for_status()
            data = resp.json()
            return TranscribeResponse(
                text=data.get("text", "").strip(),
                language=data.get("language", language or "en"),
                confidence=data.get("confidence", 1.0),
                duration_sec=data.get("duration", 0.0),
            )
        except httpx.HTTPError:
            # Non-fatal in dev: return stub
            return self._stub_transcribe()

    def _stub_transcribe(self) -> TranscribeResponse:
        return TranscribeResponse(
            text="[STT unavailable in development mode]",
            language="en",
            confidence=0.0,
            duration_sec=0.0,
        )

    # ─── TTS ────────────────────────────────────────────────────────────────

    async def synthesize(self, req: SynthesizeRequest) -> SynthesizeResponse:
        """
        Synthesize speech. Checks Redis cache first (key = SHA256 of text+voice+lang).
        """
        cache_key = self._tts_cache_key(req.text, req.voice, req.language)

        # Check cache
        cached_url = await self.rdb.get(cache_key)
        if cached_url:
            return SynthesizeResponse(audio_url=cached_url, cache_hit=True)

        # Generate audio
        if req.use_premium and self.settings.elevenlabs_api_key:
            audio_url = await self._tts_elevenlabs(req)
        elif self.settings.azure_speech_key:
            audio_url = await self._tts_azure(req)
        else:
            # Dev stub: return a placeholder URL
            audio_url = f"{self.settings.cdn_base_url}/stub/{cache_key[-8:]}.mp3"

        # Cache the CDN URL
        await self.rdb.set(cache_key, audio_url, ex=self.settings.tts_cache_ttl_sec)
        return SynthesizeResponse(audio_url=audio_url, cache_hit=False)

    async def _tts_elevenlabs(self, req: SynthesizeRequest) -> str:
        """Call ElevenLabs API and return direct audio URL (or pre-signed S3 in production)."""
        voice_id = self.settings.elevenlabs_voice_id
        resp = await self._http.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}",
            headers={
                "xi-api-key": self.settings.elevenlabs_api_key,
                "Content-Type": "application/json",
            },
            json={"text": req.text, "model_id": "eleven_turbo_v2"},
        )
        resp.raise_for_status()
        # In production: upload resp.content to S3, return CDN URL.
        # For now, return base64 data URI (not suitable for production caching).
        b64 = base64.b64encode(resp.content).decode()
        return f"data:audio/mpeg;base64,{b64}"

    async def _tts_azure(self, req: SynthesizeRequest) -> str:
        """Call Azure Cognitive Services TTS."""
        lang = req.language
        ssml = (
            f'<speak version="1.0" xml:lang="{lang}">'
            f'<voice xml:lang="{lang}">{req.text}</voice></speak>'
        )
        token_url = f"https://{self.settings.azure_speech_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
        token_resp = await self._http.post(
            token_url,
            headers={"Ocp-Apim-Subscription-Key": self.settings.azure_speech_key},
        )
        token_resp.raise_for_status()
        access_token = token_resp.text

        tts_url = f"https://{self.settings.azure_speech_region}.tts.speech.microsoft.com/cognitiveservices/v1"
        audio_resp = await self._http.post(
            tts_url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
            },
            content=ssml.encode(),
        )
        audio_resp.raise_for_status()
        b64 = base64.b64encode(audio_resp.content).decode()
        return f"data:audio/mpeg;base64,{b64}"

    # ─── Pronunciation Assessment ────────────────────────────────────────────

    async def assess_pronunciation(
        self,
        audio_bytes: bytes,
        req: AssessPronunciationRequest,
    ) -> AssessPronunciationResponse:
        """
        Phase 1: Azure Speech Pronunciation Assessment API.
        Returns overall score + per-phoneme breakdown.
        """
        if not self.settings.azure_speech_key:
            return self._stub_pronunciation()

        # Get token
        token_url = f"https://{self.settings.azure_speech_region}.api.cognitive.microsoft.com/sts/v1.0/issueToken"
        token_resp = await self._http.post(
            token_url,
            headers={"Ocp-Apim-Subscription-Key": self.settings.azure_speech_key},
        )
        token_resp.raise_for_status()
        access_token = token_resp.text

        # Pronunciation assessment config (JSON, base64-encoded in header)
        pron_config = json.dumps({
            "ReferenceText": req.reference_text,
            "GradingSystem": "HundredMark",
            "Granularity": "Phoneme",
        })
        pron_config_b64 = base64.b64encode(pron_config.encode()).decode()

        url = (
            f"https://{self.settings.azure_speech_region}.stt.speech.microsoft.com"
            f"/speech/recognition/conversation/cognitiveservices/v1"
            f"?language={req.language}&format=detailed"
        )
        assess_resp = await self._http.post(
            url,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
                "Pronunciation-Assessment": pron_config_b64,
            },
            content=audio_bytes,
        )
        assess_resp.raise_for_status()
        data = assess_resp.json()

        # Parse Azure response
        pa = data.get("NBest", [{}])[0].get("PronunciationAssessment", {})
        phonemes: list[PhonemeScore] = []
        for word in data.get("NBest", [{}])[0].get("Words", []):
            for ph in word.get("Phonemes", []):
                score = ph.get("PronunciationAssessment", {}).get("AccuracyScore", 0.0)
                phonemes.append(PhonemeScore(
                    phoneme=ph.get("Phoneme", ""),
                    score=score,
                    correct=score >= 60.0,
                ))

        return AssessPronunciationResponse(
            overall_score=pa.get("PronScore", 0.0),
            accuracy_score=pa.get("AccuracyScore", 0.0),
            fluency_score=pa.get("FluencyScore", 0.0),
            completeness_score=pa.get("CompletenessScore", 0.0),
            phonemes=phonemes,
        )

    def _stub_pronunciation(self) -> AssessPronunciationResponse:
        return AssessPronunciationResponse(
            overall_score=0.0,
            accuracy_score=0.0,
            fluency_score=0.0,
            completeness_score=0.0,
            phonemes=[],
        )

    # ─── Helpers ────────────────────────────────────────────────────────────

    def _tts_cache_key(self, text: str, voice: str, lang: str) -> str:
        h = hashlib.sha256(f"{text}|{voice}|{lang}".encode()).hexdigest()
        return f"tts:cache:{h}"

    async def close(self) -> None:
        await self._http.aclose()

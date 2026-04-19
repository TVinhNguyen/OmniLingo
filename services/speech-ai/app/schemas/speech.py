"""
Pydantic schemas for speech-ai-service.
"""
from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


# ─── STT Schemas ──────────────────────────────────────────────────────────────

class TranscribeResponse(BaseModel):
    text: str
    language: str          # detected language code
    confidence: float      # 0.0–1.0
    duration_sec: float


# ─── TTS Schemas ──────────────────────────────────────────────────────────────

class SynthesizeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    language: str = Field(default="en", max_length=10)  # BCP-47
    voice: str = Field(default="default", max_length=80)
    # Tier determines which TTS engine: "premium" → ElevenLabs, else Azure
    use_premium: bool = False


class SynthesizeResponse(BaseModel):
    audio_url: str   # CDN or pre-signed S3 URL
    cache_hit: bool
    duration_sec: Optional[float] = None


# ─── Pronunciation Assessment ──────────────────────────────────────────────────

class AssessPronunciationRequest(BaseModel):
    reference_text: str = Field(..., min_length=1, max_length=500)
    language: str = Field(default="en", max_length=10)


class PhonemeScore(BaseModel):
    phoneme: str
    score: float       # 0.0–100.0
    correct: bool


class AssessPronunciationResponse(BaseModel):
    overall_score: float          # 0.0–100.0
    accuracy_score: float
    fluency_score: float
    completeness_score: float
    phonemes: list[PhonemeScore]  # per-phoneme breakdown

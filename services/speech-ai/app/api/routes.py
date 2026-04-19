"""
speech-ai-service API routes.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from app.middleware.auth import get_current_user_id
from app.schemas.speech import (
    AssessPronunciationRequest,
    AssessPronunciationResponse,
    SynthesizeRequest,
    SynthesizeResponse,
    TranscribeResponse,
)
from app.services.speech_service import SpeechService

router = APIRouter(prefix="/api/v1/speech", tags=["speech"])


def get_speech_service() -> SpeechService:
    raise NotImplementedError("SpeechService not injected")


# ─── STT ──────────────────────────────────────────────────────────────────────

@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe(
    audio: UploadFile = File(..., description="Audio file (webm/wav/mp3, max 10MB)"),
    language: str = Form(default=""),
    user_id: str = Depends(get_current_user_id),
    svc: SpeechService = Depends(get_speech_service),
) -> TranscribeResponse:
    """
    Speech-to-text transcription.
    Uses self-hosted Whisper; falls back to stub in dev if unavailable.
    """
    content = await audio.read()
    if len(content) > 10 * 1024 * 1024:  # 10 MB limit
        raise HTTPException(status_code=413, detail="audio file too large (max 10MB)")
    return await svc.transcribe(audio_bytes=content, language=language or None)


# ─── TTS ──────────────────────────────────────────────────────────────────────

@router.post("/synthesize", response_model=SynthesizeResponse)
async def synthesize(
    req: SynthesizeRequest,
    user_id: str = Depends(get_current_user_id),
    svc: SpeechService = Depends(get_speech_service),
) -> SynthesizeResponse:
    """
    Text-to-speech synthesis.
    Cached per (text, voice, language) hash — 30-day TTL.
    """
    return await svc.synthesize(req=req)


# ─── Pronunciation ────────────────────────────────────────────────────────────

@router.post("/pronunciation/assess", response_model=AssessPronunciationResponse)
async def assess_pronunciation(
    audio: UploadFile = File(..., description="Audio recording (wav/webm)"),
    reference_text: str = Form(...),
    language: str = Form(default="en"),
    user_id: str = Depends(get_current_user_id),
    svc: SpeechService = Depends(get_speech_service),
) -> AssessPronunciationResponse:
    """
    Pronunciation assessment.
    Phase 1: Azure Speech Pronunciation Assessment API.
    Returns overall score + per-phoneme breakdown.
    """
    content = await audio.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="audio file too large (max 10MB)")

    req = AssessPronunciationRequest(reference_text=reference_text, language=language)
    return await svc.assess_pronunciation(audio_bytes=content, req=req)

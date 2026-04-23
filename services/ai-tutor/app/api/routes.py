"""
ai-tutor-service HTTP API routes.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.middleware.auth import get_current_user_id
from app.schemas.chat import ChatRequest, ChatResponse, ConversationHistory, ExplainRequest, ExplainResponse
from app.services.tutor_service import TutorService

router = APIRouter(prefix="/api/v1/tutor", tags=["tutor"])


def get_tutor_service() -> TutorService:
    """FastAPI dependency — overridden in main.py via app.dependency_overrides."""
    raise NotImplementedError("TutorService not injected")


# ─── Chat ─────────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=ChatResponse, status_code=200)
async def chat(
    req: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    svc: TutorService = Depends(get_tutor_service),
) -> ChatResponse:
    """
    Send a chat message to the AI tutor.
    Maintains conversation history in Redis (TTL per session idle time).
    """
    # TODO: fetch user tier from entitlement-service (Phase 1.5 — use free as default for now)
    user_tier = "free"
    return await svc.chat(user_id=user_id, req=req, user_tier=user_tier)


# ─── Explain ──────────────────────────────────────────────────────────────────

@router.post("/explain", response_model=ExplainResponse, status_code=200)
async def explain(
    req: ExplainRequest,
    user_id: str = Depends(get_current_user_id),
    svc: TutorService = Depends(get_tutor_service),
) -> ExplainResponse:
    """
    AI Explain Magic — contextual explanation of a word or phrase.
    Response is cached in llm-gateway (same prompt = cached answer).
    """
    return await svc.explain(user_id=user_id, req=req)


# ─── Conversation History ─────────────────────────────────────────────────────

@router.get("/conversations/{conversation_id}", status_code=200)
async def get_conversation(
    conversation_id: str,
    user_id: str = Depends(get_current_user_id),
    svc: TutorService = Depends(get_tutor_service),
) -> dict:
    """Get conversation message history."""
    history = await svc.get_history(user_id=user_id, conv_id=conversation_id)
    return {"conversation_id": conversation_id, "messages": history}


@router.get("/conversations", status_code=200)
async def list_conversations(
    user_id: str = Depends(get_current_user_id),
    svc: TutorService = Depends(get_tutor_service),
) -> dict:
    """List all conversations for the current user (scan Redis keys for this user)."""
    conversations = await svc.list_conversations(user_id=user_id)
    return {"conversations": conversations}

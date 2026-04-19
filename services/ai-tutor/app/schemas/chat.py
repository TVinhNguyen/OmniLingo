"""
Pydantic schemas for ai-tutor-service API.
"""
from __future__ import annotations

from enum import Enum
from typing import Literal, Optional
from pydantic import BaseModel, Field


class Role(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(..., min_length=1, max_length=8000)


class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None  # None = start new conversation
    message: str = Field(..., min_length=1, max_length=4000)
    language: str = Field(default="en", max_length=5)   # BCP-47
    native_language: str = Field(default="vi", max_length=5)
    level: Optional[str] = None  # A1/A2/B1/B2/C1/C2 or JLPT N5-N1


class ChatResponse(BaseModel):
    conversation_id: str
    message: ChatMessage
    tokens_used: int
    quota_remaining: int  # -1 = unlimited


class ConversationHistory(BaseModel):
    conversation_id: str
    messages: list[ChatMessage]
    language: str
    created_at: float
    updated_at: float


class ExplainRequest(BaseModel):
    """Quick contextual explanation of a word or phrase (used by AI Explain button)."""
    text: str = Field(..., min_length=1, max_length=500)
    context: Optional[str] = Field(default=None, max_length=1000)
    language: str = Field(default="en", max_length=5)
    native_language: str = Field(default="vi", max_length=5)


class ExplainResponse(BaseModel):
    explanation: str
    examples: list[str]
    tokens_used: int

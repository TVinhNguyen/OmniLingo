"""
ai-tutor core service: manages conversation history (Redis) + calls llm-gateway.
"""
from __future__ import annotations

import json
import time
import uuid

import httpx
import redis.asyncio as aioredis

from app.core.config import Settings
from app.schemas.chat import ChatMessage, ChatRequest, ChatResponse, ExplainRequest, ExplainResponse, Role

# System prompt template for the AI tutor
_TUTOR_SYSTEM_PROMPT = """You are OmniLingo AI Tutor, an expert language teacher specializing in {language}.
You are helping a {level} learner whose native language is {native_language}.

Rules:
- Keep responses concise (2-5 sentences unless the user asks for detail).
- When correcting grammar, always explain WHY briefly.
- Use the learner's native language ({native_language}) for explanations when helpful.
- Do NOT switch to English unless explicitly asked.
- If the user makes an error, correct it gently and continue the conversation naturally.
"""

_EXPLAIN_PROMPT = """Explain the word/phrase "{text}" in {language} to a language learner.
{context_line}
Native language for explanation: {native_language}.
Respond in JSON: {{"explanation": "...", "examples": ["...", "..."]}}"""


class TutorService:
    def __init__(self, settings: Settings, rdb: aioredis.Redis):
        self.settings = settings
        self.rdb = rdb
        self._llm_client = httpx.AsyncClient(
            base_url=settings.llm_gateway_url,
            timeout=90.0,
        )

    async def chat(
        self,
        user_id: str,
        req: ChatRequest,
        user_tier: str = "free",
    ) -> ChatResponse:
        # 1. Rate limit check
        quota_remaining = await self._check_and_decrement_quota(user_id, user_tier)
        if quota_remaining == 0:
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail={"error": "RATE_LIMITED", "message": "Daily message quota exceeded. Upgrade your plan for more."},
            )

        # 2. Load or create conversation
        conv_id = req.conversation_id or str(uuid.uuid4())
        history = await self._load_history(user_id, conv_id)

        # 3. Build messages for llm-gateway
        system_msg = _TUTOR_SYSTEM_PROMPT.format(
            language=req.language,
            native_language=req.native_language,
            level=req.level or "intermediate",
        )
        messages = [{"role": "system", "content": system_msg}]
        for m in history[-self.settings.max_history_messages:]:
            messages.append({"role": m["role"], "content": m["content"]})
        messages.append({"role": "user", "content": req.message})

        # 4. Call llm-gateway
        llm_resp = await self._llm_client.post(
            "/api/v1/completions/",
            headers={"Authorization": "Bearer internal"},  # service-to-service; gateway validates user ID from body
            json={
                "messages": messages,
                "caller_service": "ai-tutor",
                "max_tokens": 512,
                "use_cache": False,  # conversations shouldn't be cached
            },
        )
        llm_resp.raise_for_status()
        llm_data = llm_resp.json()
        assistant_content: str = llm_data.get("content", "")
        tokens_used: int = llm_data.get("total_tokens", 0)

        # 5. Persist updated history
        history.append({"role": "user", "content": req.message})
        history.append({"role": "assistant", "content": assistant_content})
        await self._save_history(user_id, conv_id, history, req.language)

        return ChatResponse(
            conversation_id=conv_id,
            message=ChatMessage(role=Role.assistant, content=assistant_content),
            tokens_used=tokens_used,
            quota_remaining=quota_remaining - 1 if quota_remaining > 0 else -1,
        )

    async def explain(self, user_id: str, req: ExplainRequest) -> ExplainResponse:
        context_line = f"Context: {req.context}" if req.context else ""
        prompt = _EXPLAIN_PROMPT.format(
            text=req.text,
            language=req.language,
            native_language=req.native_language,
            context_line=context_line,
        )
        llm_resp = await self._llm_client.post(
            "/api/v1/completions/",
            headers={"Authorization": "Bearer internal"},
            json={
                "messages": [{"role": "user", "content": prompt}],
                "caller_service": "ai-tutor-explain",
                "max_tokens": 256,
                "use_cache": True,  # explanations are cacheable
            },
        )
        llm_resp.raise_for_status()
        data = llm_resp.json()
        content = data.get("content", "{}")
        tokens_used = data.get("total_tokens", 0)

        try:
            parsed = json.loads(content)
            return ExplainResponse(
                explanation=parsed.get("explanation", content),
                examples=parsed.get("examples", []),
                tokens_used=tokens_used,
            )
        except (json.JSONDecodeError, KeyError):
            return ExplainResponse(explanation=content, examples=[], tokens_used=tokens_used)

    async def get_history(self, user_id: str, conv_id: str) -> list[dict]:
        return await self._load_history(user_id, conv_id)

    # ─── Redis helpers ──────────────────────────────────────────────────────

    def _history_key(self, user_id: str, conv_id: str) -> str:
        return f"tutor:history:{user_id}:{conv_id}"

    def _quota_key(self, user_id: str) -> str:
        import datetime
        today = datetime.date.today().isoformat()
        return f"tutor:quota:{user_id}:{today}"

    async def _load_history(self, user_id: str, conv_id: str) -> list[dict]:
        key = self._history_key(user_id, conv_id)
        raw = await self.rdb.get(key)
        if raw is None:
            return []
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return []

    async def _save_history(self, user_id: str, conv_id: str, history: list[dict], language: str) -> None:
        key = self._history_key(user_id, conv_id)
        await self.rdb.set(key, json.dumps(history), ex=self.settings.conversation_ttl_sec)

    async def _check_and_decrement_quota(self, user_id: str, tier: str) -> int:
        """
        Returns remaining quota after this request.
        Returns -1 if unlimited.
        Returns 0 if exhausted (caller should reject).
        """
        limits = {
            "free": self.settings.rate_limit_free,
            "plus": self.settings.rate_limit_plus,
            "pro": self.settings.rate_limit_pro,
            "ultimate": self.settings.rate_limit_ultimate,
        }
        limit = limits.get(tier, self.settings.rate_limit_free)
        if limit < 0:
            return -1  # unlimited

        key = self._quota_key(user_id)
        used = await self.rdb.incr(key)
        if used == 1:
            # First use today — set TTL to end of day
            await self.rdb.expire(key, 86400)

        remaining = max(0, limit - used)
        return remaining

    async def close(self) -> None:
        await self._llm_client.aclose()

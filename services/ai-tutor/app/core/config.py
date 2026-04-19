"""
ai-tutor-service configuration.
Reads from environment variables with safe defaults.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    env: str = "development"
    port: int = 3021
    version: str = "dev"

    # Identity service (JWKS)
    identity_service_url: str = "http://localhost:3001"

    # llm-gateway (internal)
    llm_gateway_url: str = "http://localhost:3020"

    # speech-ai-service (internal)
    speech_ai_url: str = "http://localhost:3022"

    # Redis — conversation history + rate limiting
    redis_url: str = "redis://localhost:6379"
    conversation_ttl_sec: int = 3600  # 1 hour idle TTL

    # Max messages kept in context per conversation
    max_history_messages: int = 20

    # Rate limits per tier (messages/day)
    rate_limit_free: int = 10
    rate_limit_plus: int = 50
    rate_limit_pro: int = -1       # -1 = unlimited
    rate_limit_ultimate: int = -1

    # CORS (comma-separated origins)
    allowed_origins: str = "http://localhost:3000,http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()

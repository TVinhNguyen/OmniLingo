"""
speech-ai-service configuration.
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    env: str = "development"
    port: int = 3022
    version: str = "dev"

    # Identity service (JWKS)
    identity_service_url: str = "http://localhost:3001"

    # STT — Whisper (self-hosted via faster-whisper compatible REST)
    # Set to empty string to use Azure fallback directly
    whisper_url: str = "http://localhost:9000"  # local faster-whisper server

    # TTS
    # ElevenLabs (premium users)
    elevenlabs_api_key: str = ""
    elevenlabs_voice_id: str = "21m00Tcm4TlvDq8ikWAM"  # Rachel (default)

    # Azure Speech (free/plus fallback for TTS; Phase 1 pronunciation assessment)
    azure_speech_key: str = ""
    azure_speech_region: str = "eastus"

    # S3/CDN for TTS cache
    s3_bucket: str = "omnilingo-tts-cache"
    cdn_base_url: str = "https://cdn.omnilingo.com/tts"

    # Redis — TTS response cache
    redis_url: str = "redis://localhost:6379"
    tts_cache_ttl_sec: int = 86400 * 30  # 30 days (TTS audio is immutable per hash)

    # CORS
    allowed_origins: str = "http://localhost:3000,http://localhost:5173"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache
def get_settings() -> Settings:
    return Settings()

"""
speech-ai-service FastAPI entrypoint.
"""
from __future__ import annotations

import redis.asyncio as aioredis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.routes import get_speech_service, router
from app.core.config import get_settings
from app.services.speech_service import SpeechService

settings = get_settings()


def create_app() -> FastAPI:
    app = FastAPI(
        title="OmniLingo Speech AI Service",
        version=settings.version,
        docs_url="/docs" if settings.env != "production" else None,
        redoc_url=None,
    )

    origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
        expose_headers=["X-Request-ID"],
    )

    # Body size limit — 10MB (audio uploads are large but need a ceiling)
    _max_body = 10 * 1024 * 1024  # 10 MB
    @app.middleware("http")
    async def limit_body_size(request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > _max_body:
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=413,
                content={"error": "PAYLOAD_TOO_LARGE", "message": "Request body exceeds 10MB limit"},
            )
        return await call_next(request)

    Instrumentator().instrument(app).expose(app, endpoint="/metrics")
    app.include_router(router)

    @app.get("/healthz", tags=["health"])
    def healthz() -> dict:
        return {"status": "ok"}

    @app.get("/readyz", tags=["health"])
    async def readyz() -> dict:
        try:
            rdb = _get_redis()
            await rdb.ping()
        except Exception as exc:
            from fastapi import HTTPException
            raise HTTPException(status_code=503, detail=str(exc))
        return {"status": "ready"}

    rdb = _get_redis()
    speech_svc = SpeechService(settings=settings, rdb=rdb)
    app.dependency_overrides[get_speech_service] = lambda: speech_svc

    @app.on_event("shutdown")
    async def shutdown() -> None:
        await speech_svc.close()
        await rdb.aclose()

    return app


def _get_redis() -> aioredis.Redis:
    return aioredis.from_url(settings.redis_url, decode_responses=False)


app = create_app()

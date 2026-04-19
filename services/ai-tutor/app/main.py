"""
ai-tutor-service FastAPI application entrypoint.
"""
from __future__ import annotations

import redis.asyncio as aioredis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator

from app.api.routes import get_tutor_service, router
from app.core.config import get_settings
from app.services.tutor_service import TutorService

settings = get_settings()


def create_app() -> FastAPI:
    app = FastAPI(
        title="OmniLingo AI Tutor Service",
        version=settings.version,
        docs_url="/docs" if settings.env != "production" else None,
        redoc_url=None,
    )

    # CORS — whitelist only
    origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type", "Authorization", "X-Request-ID"],
        expose_headers=["X-Request-ID"],
    )

    # Body size limit — 64KB to prevent DoS (text chat payloads only)
    @app.middleware("http")
    async def limit_body_size(request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 65_536:
            from fastapi.responses import JSONResponse
            return JSONResponse(
                status_code=413,
                content={"error": "PAYLOAD_TOO_LARGE", "message": "Request body exceeds 64KB limit"},
            )
        return await call_next(request)

    # Prometheus
    Instrumentator().instrument(app).expose(app, endpoint="/metrics")

    # Routes
    app.include_router(router)

    # Health
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
            raise HTTPException(status_code=503, detail=f"redis unreachable: {exc}")
        return {"status": "ready"}

    # DI: inject TutorService
    rdb = _get_redis()
    tutor_svc = TutorService(settings=settings, rdb=rdb)
    app.dependency_overrides[get_tutor_service] = lambda: tutor_svc

    @app.on_event("shutdown")
    async def shutdown() -> None:
        await tutor_svc.close()
        await rdb.aclose()

    return app


def _get_redis() -> aioredis.Redis:
    return aioredis.from_url(settings.redis_url, decode_responses=True)


app = create_app()

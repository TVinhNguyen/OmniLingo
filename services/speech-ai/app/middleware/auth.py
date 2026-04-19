"""
JWT authentication middleware for ai-tutor-service.
Verifies RS256 JWT from identity-service JWKS endpoint.
Caches public keys for 1 hour.
"""
import time
from functools import lru_cache
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import Settings, get_settings

_bearer = HTTPBearer(auto_error=False)

# In-memory JWKS cache: {kid: key_dict}, refreshed if stale
_jwks_cache: dict = {}
_jwks_fetched_at: float = 0.0
_JWKS_TTL = 3600.0  # 1 hour


def _get_jwks(settings: Settings) -> dict:
    global _jwks_cache, _jwks_fetched_at
    now = time.monotonic()
    if _jwks_cache and (now - _jwks_fetched_at) < _JWKS_TTL:
        return _jwks_cache
    try:
        resp = httpx.get(
            f"{settings.identity_service_url}/.well-known/jwks.json",
            timeout=10,
        )
        resp.raise_for_status()
        keys = {k["kid"]: k for k in resp.json().get("keys", []) if k.get("kid")}
        _jwks_cache = keys
        _jwks_fetched_at = now
    except Exception:
        # Return stale cache rather than failing auth on transient JWKS failure
        pass
    return _jwks_cache


def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    settings: Settings = Depends(get_settings),
) -> str:
    """
    FastAPI dependency that validates RS256 JWT and returns the user_id (sub claim).
    Raises HTTP 401 if token is missing, invalid, or expired.
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "UNAUTHORIZED", "message": "authentication required"},
        )

    token = credentials.credentials
    try:
        # Peek at header to get kid without verifying
        header = jwt.get_unverified_header(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "TOKEN_INVALID", "message": "malformed token"},
        )

    kid = header.get("kid", "")
    alg = header.get("alg", "")
    if alg != "RS256":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "TOKEN_INVALID", "message": "unexpected signing algorithm"},
        )

    jwks = _get_jwks(settings)
    # Try specific kid first, then any key if kid not in token
    key = jwks.get(kid) or (next(iter(jwks.values()), None) if not kid else None)
    if key is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "TOKEN_INVALID", "message": "unknown signing key"},
        )

    try:
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience="omnilingo",
            options={"require": ["sub", "exp", "iat"]},
        )
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "TOKEN_INVALID", "message": str(exc)},
        )

    user_id: str = payload.get("sub", "")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "TOKEN_INVALID", "message": "missing subject claim"},
        )
    return user_id

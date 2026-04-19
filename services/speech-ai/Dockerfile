FROM python:3.11-slim AS base
WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

COPY --chown=appuser:appgroup . .

EXPOSE 3022
USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3022", "--workers", "2"]

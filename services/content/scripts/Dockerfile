FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY . .
RUN pip install --no-cache-dir -e .

CMD ["make", "help"]

FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential libffi-dev \
 && rm -rf /var/lib/apt/lists/*

COPY api-gateway/pyproject.toml .

RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
 && ~/.local/bin/uv lock --no-cache \
 && ~/.local/bin/uv sync --no-cache

COPY api-gateway/ .
COPY shared/ shared/

ENV PYTHONPATH=/app
ENV PATH="/app/.venv/bin:$PATH"

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl build-essential libffi-dev \
 && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml .
RUN curl -LsSf https://astral.sh/uv/install.sh | sh \
 && ~/.local/bin/uv lock --no-cache \
 && ~/.local/bin/uv sync --no-cache

COPY . .

ENV PYTHONPATH=/app
ENV PATH="/app/.venv/bin:$PATH"

WORKDIR /app/

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
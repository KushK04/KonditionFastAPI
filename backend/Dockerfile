FROM python:3.10

ENV PYTHONUNBUFFERED=1

WORKDIR /app/

# Install uv
COPY --from=ghcr.io/astral-sh/uv:0.5.11 /uv /uvx /bin/

# Set env
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH=/app
ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

# Copy and install dependencies
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-install-project

# Copy the rest
COPY scripts /app/scripts
COPY alembic.ini .
COPY app /app/app

# Final install
RUN uv sync

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]

#!/usr/bin/env bash
# One-command local bootstrap: Postgres up, roles + migrations applied,
# dependencies installed, dev server started.
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required (used to run local Postgres). Install Docker Desktop / Docker Engine and re-run." >&2
  exit 1
fi

if [ ! -f .env ]; then
  echo "No .env found, copying .env.example -> .env (local defaults, fine for dev)."
  cp .env.example .env
fi

echo "Starting Postgres (docker compose)..."
docker compose up -d db

echo "Waiting for Postgres to be healthy..."
for _ in $(seq 1 30); do
  status="$(docker compose ps db --format '{{.Health}}' 2>/dev/null || true)"
  if [ "$status" = "healthy" ]; then
    break
  fi
  sleep 1
done
if [ "$status" != "healthy" ]; then
  echo "Postgres did not become healthy in time. Check 'docker compose logs db'." >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Applying database migrations (schema + Row-Level Security policies)..."
npx prisma migrate deploy

echo "Generating Prisma Client..."
npx prisma generate

echo "Seeding demo data (skipped if already present)..."
npm run db:seed

echo
echo "Setup complete. Starting the dev server on http://localhost:3000"
echo "(Ctrl+C to stop; Postgres keeps running in the background -- 'npm run db:down' to stop it.)"
npm run dev

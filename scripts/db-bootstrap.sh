#!/bin/bash
set -e

# Bootstrap local workspace: env vars, database migration, and seed
# Usage: npm run db:bootstrap

# --- .dev.vars setup ---
if [ ! -f .dev.vars ]; then
  echo "==> Creating .dev.vars from .env.example..."
  cp .env.example .dev.vars
  echo "    Edit .dev.vars with your actual values before running dev server."
else
  echo "==> .dev.vars already exists, skipping."
fi

echo "==> Removing existing local D1 state..."
rm -rf .wrangler/state

echo "==> Running migrations..."
npx wrangler d1 execute faha-db --local --file=src/db/migrations/0000_slimy_supreme_intelligence.sql

echo "==> Seeding data..."
npx wrangler d1 execute faha-db --local --file=src/db/seed.sql

echo "==> Done! Local database is ready."

#!/bin/bash
set -e

# Bootstrap local workspace: env vars, database migration, and seed
# Usage: npm run db:bootstrap


echo "==> Removing existing local D1 state..."
rm -rf .wrangler/state

echo "==> Running migrations..."
npx wrangler d1 execute faha-db --local --file=src/db/migrations/0000_slimy_supreme_intelligence.sql
npx wrangler d1 execute faha-db --local --file=src/db/migrations/0001_pending_subscribers.sql

echo "==> Seeding data..."
npx wrangler d1 execute faha-db --local --file=src/db/seed.sql

echo "==> Done! Local database is ready."

#!/bin/bash
set -e

# Run all D1 migrations in order.
# Usage: bash scripts/db-migrate.sh [--local|--remote]
#   --local   (default) run against local D1
#   --remote  run against production D1

TARGET="--local"
if [ "$1" = "--remote" ]; then
  TARGET="--remote"
fi

echo "==> Running migrations ($TARGET)..."
for f in $(ls src/db/migrations/*.sql | sort); do
  echo "    $f"
  npx wrangler d1 execute faha-db $TARGET --file="$f"
done
echo "==> Migrations complete."

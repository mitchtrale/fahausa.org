#!/bin/bash
set -e

# Bump the patch version in package.json and amend the latest commit.
# Called automatically by the pre-push git hook.

cd "$(git rev-parse --show-toplevel)"

CURRENT=$(node -p "require('./package.json').version")
IFS='.' read -r major minor patch <<< "$CURRENT"
NEW="${major}.${minor}.$((patch + 1))"

# Update package.json in place (portable sed)
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.version = '${NEW}';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

git add package.json
git commit -m "v${NEW}"

echo "==> Version bumped: ${CURRENT} → ${NEW}"

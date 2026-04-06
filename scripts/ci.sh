#!/bin/bash

# ci.sh - Continuous Integration validation script for ShopSmart

# Exit immediately on error
set -e

echo "🚦 Starting CI checks..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# --- Server ---
echo "🖥️  Validating server..."
cd "${PROJECT_ROOT}/server"
npm ci
npx prisma generate
npm run lint
npm test

# --- Client ---
if [ -d "${PROJECT_ROOT}/client" ]; then
    echo "🎨 Validating client..."
    cd "${PROJECT_ROOT}/client"
    npm ci
    npm run lint
    npm run build
fi

echo "✅ CI checks completed successfully!"
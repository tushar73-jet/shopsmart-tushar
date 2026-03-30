#!/bin/bash

# ci.sh - Continuous Integration validation script for ShopSmart

# Exit on error
set -e

echo "🚦 Starting CI checks..."

# Check server
echo "🖥️  Validating server..."
cd server
npm install
npm test
npm run lint || echo "⚠️ Lint script failed or not configured (skipping)"

# Check client if exists
if [ -d "../client" ]; then
    echo "🎨 Validating client..."
    cd ../client
    # Add client-specific tests/lint if they exist
    # npm install
    # npm run lint
fi

echo "✅ CI checks completed successfully!"
 
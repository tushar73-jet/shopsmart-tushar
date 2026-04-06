#!/bin/bash

# setup.sh - Idempotent initial project setup for ShopSmart Backend

set -e

echo "🚀 Starting ShopSmart setup..."

# Detect project root (handle running from project root or server/scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
SERVER_DIR="${PROJECT_ROOT}/server"
CLIENT_DIR="${PROJECT_ROOT}/client"

# Validate Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

# Validate npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

# Create required directories (idempotent)
mkdir -p "${SERVER_DIR}/logs"
mkdir -p "${SERVER_DIR}/prisma"

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install --prefix "${SERVER_DIR}"

# Set up Prisma database (idempotent — db push is safe to re-run)
echo "🗄️  Setting up Prisma database..."
(cd "${SERVER_DIR}" && npx prisma generate)
(cd "${SERVER_DIR}" && npx prisma db push)

# Seed database only if seed file exists
if [ -f "${SERVER_DIR}/prisma/seed.js" ]; then
    echo "🌱 Seeding database..."
    (cd "${SERVER_DIR}" && npx prisma db seed)
fi

# Install client dependencies if client directory exists
if [ -d "${CLIENT_DIR}" ]; then
    echo "🎨 Installing client dependencies..."
    npm install --prefix "${CLIENT_DIR}"
fi

echo "✅ Setup complete! Run 'npm run dev' inside the server directory to start."

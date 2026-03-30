#!/bin/bash

# project-check.sh - Final verification script for ShopSmart

set -e

echo "🔍 Starting project-wide validation..."

# 1. Server validation
echo "🚀 Testing Backend (Server)..."
cd "$(dirname "$0")/../server"
npm ci || npm install
npx prisma generate
npm test

echo "✅ ShopSmart is ready for feature development!"

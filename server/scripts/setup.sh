#!/bin/bash

# setup.sh - Initial project setup scripts for ShopSmart Backend


set -e

echo "🚀 Starting ShopSmart setup..."


if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi


echo "📦 Installing server dependencies..."
cd server
npm install


echo "🗄️  Setting up Prisma database..."
npx prisma generate
npx prisma db push


if [ -f "prisma/seed.js" ]; then
    echo "🌱 Seeding database..."
    npx prisma db seed
fi

echo "✅ Setup complete! You can now run 'npm run dev' to start the server."

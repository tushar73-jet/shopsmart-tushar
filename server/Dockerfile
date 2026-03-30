# Use Node.js 20 slim as the base image
FROM node:20-slim AS base

# Install OpenSSL (needed for Prisma)
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy application source
COPY . .

# Expose port (Backend code uses 5001 by default)
EXPOSE 5001

# Start command
CMD ["npm", "start"]

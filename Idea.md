# ShopSmart — Project Idea

## Overview

**ShopSmart** is a full-stack e-commerce management platform that lets small businesses manage their product catalogue, user accounts, and orders through a clean React-powered dashboard backed by a lightweight Node/Express REST API.

The project demonstrates a production-ready development workflow — containerised with Docker, deployed automatically via CI/CD, and kept secure through automated dependency updates.

---

## Problem Statement

Small online retailers often rely on spreadsheets or expensive SaaS platforms to manage products and orders. ShopSmart provides a self-hosted, open-source alternative that is easy to extend and cheap to run.

---

## Core Features

| Feature | Description |
|---|---|
| **Product Catalogue** | Full CRUD — create, read, update, delete products with name, price, and description |
| **User Management** | Register and manage customer accounts |
| **Order Tracking** | Place and query orders linked to users and products |
| **Health Endpoint** | `/api/health` for uptime monitoring and CI smoke tests |
| **REST API** | JSON REST API following standard HTTP conventions |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, React Router |
| Backend | Node.js 20, Express 4 |
| Database | SQLite 3 (via Prisma ORM) |
| Containerisation | Docker + Docker Compose |
| CI/CD | GitHub Actions (lint + test + build on every PR) |
| Deployment | Render (backend) · Vercel (frontend) |
| Dependency updates | Dependabot (weekly npm + Actions bumps) |

---

## Architecture

```
┌─────────────────────┐        HTTP/JSON        ┌───────────────────────┐
│   React Client      │ ──────────────────────► │  Express REST API     │
│   (Vite, port 80)   │                         │  (Node, port 5001)    │
└─────────────────────┘                         └────────────┬──────────┘
                                                             │ Prisma ORM
                                                             ▼
                                                    ┌────────────────┐
                                                    │  SQLite DB     │
                                                    │  (dev.db)      │
                                                    └────────────────┘
```

Both services run in separate Docker containers orchestrated by `docker-compose.yml`.

---

## CI/CD Pipeline

Every pull request into `main` triggers two parallel jobs:

1. **server-ci** — `npm ci` → Prisma generate → ESLint → Jest tests  
2. **client-ci** — `npm ci` → ESLint → Vite build

Merges to `main` are blocked unless both jobs pass.

---

## Development Setup

```bash
# Clone and run everything
git clone <repo-url>
cd shopsmart-tushar

# One-shot idempotent setup
bash server/scripts/setup.sh

# Start with Docker
docker-compose up --build
```

Or run individually:

```bash
# Backend
cd server && npm run dev   # http://localhost:5001

# Frontend
cd client && npm run dev   # http://localhost:5173
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/users` | Create user |
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/products` | Create product |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get product by ID |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | List all orders |
| GET | `/api/orders/:id` | Get order by ID |

---

## Future Improvements

- Authentication (JWT)
- Stripe payment integration
- AWS EC2 production deployment with GitHub Actions self-hosted runner
- End-to-end tests with Cypress
- Admin dashboard with sales analytics

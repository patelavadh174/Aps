# HomeBoost Complete Codebase

HomeBoost is a full-stack employee benefit portal for employer-sponsored home-buying guidance. This repository implements the expanded project report as a runnable MVP with role-based dashboards, public employer portals, employee learning, quizzes, messaging, CSV enrollment, CMS content, and admin/HBT operations.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + MySQL
- Auth: JWT + bcryptjs + role-based access control
- Security: Helmet, CORS allowlist, rate limiting, Zod validation
- Uploads: CSV enrollment through multer + csv-parse
- Deployment targets: Vercel frontend + Railway backend/MySQL

## Repository layout

```text
homeboost-complete-code/
  backend/                Express API, MySQL schema, seed scripts
  frontend/               React/Vite app
  docs/                   implementation notes and API map
  .gitignore
  package.json            root helper scripts
```

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run db:schema
npm run db:seed
npm run dev
```

Backend defaults to `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend defaults to `http://localhost:5173`.

## Demo accounts

After running `npm run db:seed`, all demo users use the password:

```text
Password123!
```

| Role | Email |
|---|---|
| Admin | admin@homeboost.test |
| HBT Admin | hbt.admin@homeboost.test |
| HBT Member | hbt.member@homeboost.test |
| Employee | employee@homeboost.test |

## Production checklist

- Delete all demo data before client launch.
- Keep `.env` files out of Git and ZIP packages.
- Rotate secrets after any public sharing.
- Run frontend build, backend syntax check, and at least the smoke tests.
- Configure CORS to the real Vercel production domain.
- Configure Railway environment variables with private MySQL credentials.
- Enable backups and structured logs before handling real employee information.

## Core commands

```bash
# Root
npm run install:all
npm run build
npm run check

# Backend
npm run dev
npm start
npm run db:schema
npm run db:seed
npm run check

# Frontend
npm run dev
npm run build
npm run preview
npm run check
```

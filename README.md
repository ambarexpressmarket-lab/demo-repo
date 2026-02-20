# Task List Demo

**Full-stack + DevOps demo** — Next.js, Tailwind, Supabase (PostgreSQL), Docker, Vercel.

CRUD tasks with categories. Demonstrates: frontend, backend, API, database, containerization, CI/CD.

**Live demo:** [https://demo-repo-iota-tawny.vercel.app](https://demo-repo-iota-tawny.vercel.app)

---

## Skills demonstrated

| Category | Technologies |
|----------|--------------|
| **Frontend** | Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide icons |
| **Backend** | Next.js API Routes, REST API |
| **Database** | Supabase (PostgreSQL), SQL |
| **DevOps** | Docker, Docker Compose, Vercel CI/CD, env config |
| **Tools** | Git, GitHub |

---

## Stack

- **Frontend:** Next.js, React, Tailwind, TypeScript
- **Backend:** API routes (GET, POST, PATCH, DELETE)
- **DB:** Supabase (PostgreSQL) or in-memory fallback
- **DevOps:** Dockerfile, docker-compose, Vercel deploy

---

## How to run

### 1. Locally (npm)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 2. Docker

```bash
docker build -t task-list-demo .
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... task-list-demo
```

### 3. Docker Compose

```bash
docker compose up --build
```

Optional: create `.env` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` — otherwise in-memory.

---

## Supabase (optional)

1. Create project at [supabase.com](https://supabase.com)
2. SQL Editor → run `supabase-schema.sql`
3. Settings → API → copy URL and anon key
4. Add to `.env.local` (npm) or `.env` (Docker)

Without Supabase — in-memory storage (resets on restart).

---

## Deploy to Vercel

1. Connect GitHub repo
2. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy — automatic build and publish

---

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks?category=work` | Filter by category |
| POST | `/api/tasks` | Add `{ "title": "...", "category": "work" \| "personal" \| "shopping" }` |
| PATCH | `/api/tasks` | Toggle `{ "id": "...", "action": "toggle" }` |
| DELETE | `/api/tasks?id=...` | Delete task |

---

## Project structure

```
demo-repo/
├── src/
│   ├── app/
│   │   ├── page.tsx          # UI
│   │   ├── api/tasks/        # API routes
│   │   └── layout.tsx
│   └── lib/
│       ├── tasks.ts          # Business logic, Supabase
│       └── supabase.ts       # Supabase client
├── Dockerfile
├── docker-compose.yml
├── supabase-schema.sql
└── .env.local.example
```

---

Demo by Serhiy | [Live demo](https://demo-repo-iota-tawny.vercel.app) | [Portfolio](https://...)

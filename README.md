# Task List Demo

Next.js 14 + Tailwind CSS + API routes. Simple CRUD for tasks.

## Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes
- **Storage:** In-memory (demo). Replace with Postgres/Supabase for production.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

```bash
npm run build
```

Then connect this repo to [Vercel](https://vercel.com) — one-click deploy.

## API

- `GET /api/tasks` — list tasks
- `POST /api/tasks` — add task `{ "title": "..." }`
- `PATCH /api/tasks` — toggle `{ "id": "...", "action": "toggle" }`
- `DELETE /api/tasks?id=...` — delete task

---

Demo by Serhiy | [Portfolio](https://...)

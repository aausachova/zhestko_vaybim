
# VibeCodeJam — Dev and Docker Guide

## Local dev (without Docker)

  Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

Backend (Express + SQLite) lives in `backend/`. For local dev:
1. In a second terminal:
   - `cd backend && npm i && npm start`
2. Frontend runs at `http://localhost:5173`
3. Backend runs at `http://localhost:4000`

Vite is configured to proxy `/api` to `http://localhost:4000`, so you can call `/api/*` from the frontend during dev.

Initial users (seeded on first run):
- user/user (role: user)
- admin/admin (role: admin)

---

## Dockerized dev (with Docker-in-Docker)

Compose services:
- `frontend`: Vite dev server on port 5173
- `backend`: Express API on port 4000, SQLite DB volume at `/data/app.db`
- `dind`: Docker-in-Docker daemon (for future code execution)

Start all services:
```bash
docker compose up --build
```

Open the app:
- Frontend: `http://localhost:5173`
- API: `http://localhost:4000/api/health`

You should see console logs in the browser from the frontend calling `/api/health`, and backend logs like `[backend] listening on :4000`.

Notes on DinD:
- We expose the Docker daemon on `tcp://dind:2375` inside the Compose network.
- The backend is pre-wired with `DOCKER_HOST=tcp://dind:2375` to allow future containerized code execution.
- For production, prefer rootless containers or a job-runner with stronger isolation; DinD is suited for development and controlled environments.

---

## Scripts
- Root:
  - `npm run dev` — start Vite on 5173
- Candidate frontend uses the same dev server; log in as `user/user` to open it
- Backend:
  - `npm start` — start Express on 4000

---

## Environment variables

Create `.env` (or `.env.local`) at the repo root:

```
VITE_OPENROUTER_KEY=sk-or-...   # токен OpenRouter (см. инструкцию ниже)
VITE_OPENROUTER_REF=https://github.com/shoosh/zhestko_vaybim
```

- `VITE_OPENROUTER_KEY` — обязательный ключ для запросов к OpenRouter (GPT-5 и Qwen).
- `VITE_OPENROUTER_REF` — опциональный referer, по умолчанию указывает на репозиторий.

> Пользовательский токен: `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`
> Сохраните его в `.env`, чтобы AI-интервьюер и автодополнение работали локально.

В Docker-режиме передайте переменные в `docker-compose.yml` или экспортируйте их в окружение перед запуском.

---

## Where things are
- Admin/HR frontend: `src/components/*`
- Candidate frontend (из `win/`): `src/candidate/*`
  - Основной вход: `src/candidate/CandidateApp.tsx`
  - Интервью-сессия: `src/candidate/components/InterviewSession.tsx`
- Backend API: `backend/server.js`
- AI/LLM сервисы и промпты:
  - `src/services/openRouterClient.ts`
  - `src/services/aiInterview.ts`
  - `src/prompts/interview.ts`
- Docker files:
  - `Dockerfile.frontend`
  - `backend/Dockerfile`
  - `docker-compose.yml`

---

## Health check and login
- Health: `GET /api/health` returns `{ ok: true }`
- Login: `POST /api/login` body `{ "username": "user", "password": "user" }`

---

## Candidate interview experience
- Логин `user/user` открывает полнофункциональный кабинет (`src/candidate`).
- «Отборы» запускают интервью с:
  - Таймером на 60 минут
  - Видеопотоком (с разрешения браузера)
  - Чатом с GPT-5 через OpenRouter (папка `src/prompts`)
  - Автодополнением при простое >2 секунд (Qwen coder flash)
- Первое задание скрыто, пока кандидат не обсудит подход с AI. AI отвечает в стиле Jam (Сократика + античит). Autocomplete появляются в отдельной панели с кнопками «Вставить/Скрыть».

  


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
- Backend:
  - `npm start` — start Express on 4000

---

## Where things are
- Frontend SPA: `src/`
- Backend API: `backend/`
- Docker files:
  - `Dockerfile.frontend`
  - `backend/Dockerfile`
  - `docker-compose.yml`

---

## Health check and login
- Health: `GET /api/health` returns `{ ok: true }`
- Login: `POST /api/login` body `{ "username": "user", "password": "user" }`

  

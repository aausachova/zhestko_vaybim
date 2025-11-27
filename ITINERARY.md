## VibeCodeJam — Itinerary and Implementation Tracker

This repository is a Vite + React + TypeScript front-end scaffold with a rich UI kit (Radix UI + shadcn-style components). It currently contains demo screens for an HR dashboard and an interview session. We will evolve it into a complete platform per the VibeCodeJam brief.

This document is the single source of truth for scope, phases, owners, and check-off. When a feature is implemented, mark it Done here and add implementation references (file paths/modules/PRs).

### Repo snapshot (today)
- Frontend: React 18, Vite 6, TypeScript
- UI: Radix primitives, `src/components/ui/*`, icon set `lucide-react`
- Screens: `HRDashboard`, `InterviewSession`
- Styling: `src/index.css`, `src/styles/globals.css`

---

## Phases and Checkpoints

### Phase 1 — Architecture, LLM strategy, adaptive engine (Check‑point 1)
- Architecture diagram (components + interactions)
- Scibox LLM integration strategy (prompting, session, safety)
- Adaptive difficulty design (initial calibration + dynamic progression)
- Data model draft (candidates, sessions, tasks, results, metrics)

Acceptance: Architecture doc and diagram committed; sample LLM round-trip working in dev; adaptive rules defined with examples.

### Phase 2 — Working AI interviewer + IDE + testing/metrics (Check‑point 2)
- AI interviewer conversational loop
- Adaptive task generation and progression
- Browser IDE with syntax highlighting, autocompletion, run controls
- Code execution service (isolated, resource/time limits)
- Visible/hidden tests, performance metrics, basic anti-cheat events

Acceptance: End-to-end demo of two tasks with adaptation and test feedback; metrics persisted and visualized.

### Phase 3 — Performance, end-to-end flows, demo readiness (Check‑point 3)
- Optimize execution/test pipeline and streaming UX
- Anti-cheat hardening
- Finalize admin panel and exportable reports
- Polish demo script and record video

Acceptance: Full script executed reliably; reports and exports verified; performance within targets.

---

## Workstreams and Ownership

- Designers (2x, vibecoding frontend)
  - Candidate flows, HR/admin flows, chat UX, IDE UX, metrics/report UIs
  - States for running/paused/errors, streaming responses
- Fullstack (shoosh)
  - Scibox LLM integration, orchestration, WS events, API gateway, data model
  - Connect IDE ↔ execution ↔ tests ↔ metrics, persist results
- Backend (1x)
  - Code execution sandbox (Docker/job runner), test runner, metrics pipeline
  - Anti‑cheat signals, queues, storage, observability

---

## Architecture (high-level)

- Web App (this repo): React SPA, WebSocket for realtime events
- LLM Service (Scibox): prompt templates, interview policy, safety guards
- Task Bank + Generator: seed tasks + LLM augmentation with constraints
- Execution Sandbox: containerized runners per language with limits
- Test Runner: visible + hidden tests, performance probes
- Metrics/Scoring: correctness, optimality, complexity/readability, communication
- Anti‑Cheat: clipboard/blur/devtools/extension heuristics, originality checks
- Admin API + DB: sessions, tasks, results, reports
- Realtime: WS events for task reveal, test results, interviewer messages

Note: Concrete services and repositories will be added; this doc will link them as they appear.

---

## Deliverables checklist (mark Done and add implementation references)

Use this table to manage progress. When Done, replace Status and append Implementation references (paths/PRs). Keep entries concise.

| Feature | Owner(s) | Status | Implementation references |
| --- | --- | --- | --- |
| Architecture diagram (C4/context + component) | Fullstack | todo |  |
| LLM interview policy + prompt templates | Fullstack | done | `src/prompts/interview.ts` — Jam persona + autocomplete guardrails |
| Scibox client integration (dev stub) | Fullstack | todo |  |
| Adaptive engine: calibration + progression rules | Fullstack | todo |  |
| Task bank schema + seed format | Backend, Fullstack | todo |  |
| Realtime transport (WS) contract | Fullstack | todo |  |
| Browser IDE shell (editor, tabs, run) | Designers | done | `src/candidate/components/InterviewSession.tsx` — редактор, тесты, автодополнение |
| Language support v1 (JS/TS, Python) | Backend | todo |  |
| Execution sandbox API (per‑run limits) | Backend | todo |  |
| Visible/hidden test runner | Backend | todo |  |
| Performance probes (time/memory/op count) | Backend | todo |  |
| Metrics model + persistence | Fullstack, Backend | todo |  |
| Candidate session UI (chooser, progress) | Designers | done | `src/candidate/CandidateApp.tsx`, `src/candidate/components/SelectionsPage.tsx` |
| Interview chat UI (streaming, follow‑ups) | Designers | done | `src/candidate/components/InterviewSession.tsx`, `src/services/aiInterview.ts` |
| Anti‑cheat events (clipboard/devtools/blur) | Fullstack | todo |  |
| Originality checks pipeline (stub) | Backend | todo |  |
| HR/Admin dashboard v1 | Designers | done | `src/App.tsx`, `src/hr/HrPortal.tsx`, `hr/src/App.tsx` — HR вход ведет в новую панель |
| Reports + export (PDF/CSV) | Fullstack | todo |  |
| Docker Compose dev env | Backend | done | `docker-compose.yml`, `Dockerfile.frontend`, `backend/Dockerfile` |
| Demo script coverage (full list below) | All | todo |  |

---

## Demo script mapping (what the video must show)

1) Open platform and select level
2) First task (Junior) appears; IDE shows syntax highlighting
3) Run code; visible tests pass (green checks)
4) LLM interviewer asks a question in chat
5) Candidate answers; LLM evaluates and upgrades to Middle
6) Second task appears in real time (streamed generation)
7) Candidate solution has a bug; visible pass, hidden fail
8) LLM analyzes and explains the error
9) Candidate fixes; all tests pass
10) Anti‑cheat capabilities demonstrated
11) Follow‑up dialog (couple of rounds)
12) Metrics updated
13) Final report; download result

For each item, ensure we can trigger it deterministically in dev (seeded prompts/fixtures).

---

## How to mark features Done (required)

- Update the checklist Status to `done`.
- Add concise Implementation references:
  - File paths (e.g. `src/components/InterviewSession.tsx`)
  - Service endpoints (path + method)
  - PR numbers/links and brief note
- If UX is involved, attach a screenshot in the PR and link it here.

Example entry:
- Status: done
- Implementation references:
  - `src/components/InterviewSession.tsx` — streaming UI
  - `api/execution/run` — sandbox trigger
  - PR #12 — adds progression rule v1

---

## Near‑term tasks by role (next sprint)

- Designers
  - Flesh out IDE shell (editor pane, test pane, run controls, status bar)
  - Chat panel layout and streaming bubbles
  - Candidate level selector + progress bar
- Fullstack
  - Scibox client stub and prompt templates
  - WS contract for “task_revealed”, “test_result”, “interviewer_msg”
  - Session state model (in‑memory placeholder)
- Backend
  - Local execution sandbox stub (Docker) with time/memory limit flags
  - Test runner contract and result schema
  - Metrics aggregation draft (timings, attempts, errors)

---

## Links
- Team operations and roles: `AGENTS.md`
- Dev run instructions: `README.md` (Docker setup to be added)



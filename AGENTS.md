## VibeCodeJam — Agents Guide

This guide explains the project vision, team roles, operating principles, and the required check‑off workflow. Every agent must review the ITINERARY checklist and mark items Done with implementation references when completing work.

---

## Project description (concise)

We are building a web platform that delivers a fully automated technical interview experience with an AI interviewer (powered by Scibox LLM). The system:
- Generates adaptive coding tasks (difficulty adjusts to performance)
- Provides a browser IDE with syntax highlighting, autocomplete, and debugging
- Runs code in isolated containers with time/resource limits
- Validates with visible and hidden tests, including performance probes
- Tracks rich metrics (time, attempts, complexity/readability, communication)
- Detects cheating (clipboard/devtools/blur/extension heuristics, originality)
- Offers an admin panel to curate tasks, configure interviews, and export reports

The end result includes: open-source repo with instructions (Docker recommended), system architecture with diagrams and flows, a demo video walking through a complete adaptive interview, and a presentation.

---

## Roles and scope

- Designers (2x, vibecoding)
  - End‑to‑end interview UX: level selection, task view, IDE, tests, chat
  - HR/Admin panels: results, filters, exports, reports
  - Real‑time states: streaming, running, hidden test failures, anti‑cheat banners
- Fullstack (shoosh)
  - Scibox LLM integration, prompt templates, interview policy
  - Session orchestration, realtime (WebSocket) events, API gateway
  - Metrics model and reporting endpoints
- Backend (1x)
  - Execution sandbox (Docker), test runner (visible/hidden), performance probes
  - Anti‑cheat event ingestion and originality checks (pipeline stub → v1)
  - Persistence, queues, observability

---

## Operating principles

- Thin prompts, strong policy: keep interviewer behavior bounded and reproducible
- Deterministic dev flow: allow seeded scenarios to record the demo reliably
- Stream everything that matters: tasks, chat, test progress, metrics updates
- Security as a feature: isolation, quotas, and cheat signals from day one
- Measure what we ship: correctness, optimality, complexity, readability, comms

---

## Required check‑off workflow (everyone)

1) Before starting work
   - Read `ITINERARY.md` and pick items in your scope.
   - If design/UX, align on states and transitions first.
2) When you implement a feature
   - Update `ITINERARY.md`:
     - Set Status to `done` for the item(s)
     - Add Implementation references:
       - File paths (e.g. `src/components/InterviewSession.tsx`)
       - Endpoints (path + method)
       - PR number/link and a one‑line note
     - If UI: add a screenshot to the PR and link it
3) After merging
   - Verify the demo script path is still green (see ITINERARY → Demo mapping)
   - Ping the next owner if downstream work is unblocked

Failure to add implementation references is considered incomplete.

---

## Scibox LLM integration (initial guidance)

- Session state: conversation history + task context + assessment rubric
- Prompt structure:
  - System: interviewer persona, constraints, anti‑cheat posture
  - Tools: task generator, evaluator, code reviewer (non‑executing)
  - Safety: forbid giving full solutions; allow hints and Socratic questioning
- Adaptivity v1:
  - Calibration task → score → pick next difficulty
  - Track attempts/time/edge‑case handling to adjust up/down

We will stub a local Scibox client and replace with real credentials later.

---

## Anti‑cheat (v1 plan)

- Frontend events: clipboard paste size/origin, window blur/focus, devtools detection, extension heuristics (where feasible)
- Backend checks: originality similarity metrics (stub), suspicious patterns
- UX: non‑blocking notifications and logging; no hard blocks in v1

---

## Directory and module conventions (subject to evolution)

- Web app (this repo)
  - `src/components/*` — pages and complex components
  - `src/components/ui/*` — primitive UI components
  - `src/lib/*` — utilities, adapters (e.g., `sciboxClient`, `wsClient`)
  - `src/state/*` — session state stores
  - `src/services/*` — API/WS contracts and DTOs
  - `src/features/*` — feature groupings (ide, chat, metrics, admin)

Backend services and Docker Compose will be added in dedicated folders/repos and linked from `ITINERARY.md`.

---

## How to run (current)

See `README.md`:
- `npm i`
- `npm run dev`

Dockerized workflow and service orchestration will be added; watch `ITINERARY.md`.

---

## Everyone must check the list

All agents (designers, fullstack, backend) are required to:
- Review `ITINERARY.md` at the start of each task
- After completing a task, mark it Done and add Implementation references
- Ensure the demo script can still be performed end‑to‑end

This is mandatory for traceability and demo readiness.



# NAJDA (نجدة)

National wildfire emergency coordination platform for Algeria. One shared operating
picture for citizens, responders, volunteers, and NGOs: where the fires are, who needs
help, where to go, and what is needed.

The complete product and UX specification lives in [docs/](docs/) — start with
[docs/README.md](docs/README.md). **Read the relevant module spec before implementing
any feature.**

## Stack

| Part | Tech | Port |
|---|---|---|
| `frontend/` | SolidStart (TypeScript, Tailwind CSS, pnpm) | 3000 |
| `backend/` | Rust + Axum (cargo workspace, sqlx, Redis) | 8080 |
| Postgres | PostGIS 16 (`docker-compose.dev.yml`) | 5432 |
| Redis | Redis 7 (`docker-compose.dev.yml`) | 6379 |

The browser only ever talks to one origin: the frontend serves the pages, and
`/api/*` requests are forwarded to the backend by the frontend server
([frontend/src/routes/api/[...path].ts](frontend/src/routes/api/%5B...path%5D.ts)).
Server-side code reaches the backend directly via `API_INTERNAL_URL`. No CORS needed.

## Local development

Prerequisites: Node ≥ 22 with pnpm, Rust (stable), Docker (for Postgres + Redis).

```sh
cp .env.example .env      # localhost defaults, documented per variable
make infra                # start Postgres + Redis containers
make dev                  # backend (cargo run) + frontend (pnpm dev) together
```

Then open <http://localhost:3000> — the home page shows the live
`GET /api/health` payload (API + Postgres + Redis status) and the wilayas
reference data, proving the whole path works.

| Command | What it does |
|---|---|
| `make infra` / `make infra-down` | start/stop the Postgres + Redis containers |
| `make dev` | run backend and frontend concurrently |
| `make migrate-new name=add_x` | create an empty timestamped migration file |
| `make check` | `cargo fmt --check` + `clippy -D warnings` + tests + frontend build |

No Docker available? Any Postgres 16 and Redis 7 work — point `DATABASE_URL` and
`REDIS_URL` in `.env` at them. (If a local Postgres already occupies port 5432,
set `POSTGRES_PORT=5433` in `.env` and adjust `DATABASE_URL` to match.)

### Migrations

SQL files in [backend/migrations/](backend/migrations/), run automatically by the
backend at startup (`sqlx::migrate!`). Create a new one with
`make migrate-new name=describe_the_change`, write plain SQL, restart the backend.
The first migration creates and seeds the `wilayas` reference table (all 58 wilayas,
Arabic/French/English names) — the product is organized per-wilaya.

### API endpoints

- `GET /api/health` → `{ "status": "ok"|"degraded", "postgres": "ok"|"error", "redis": "ok"|"error" }`
  (HTTP 200 when everything is up, 503 when degraded)
- `GET /api/wilayas` → the 58 wilayas from Postgres

## Deployment

Production containerization (Dockerfiles, production compose, Dokploy setup) is
deliberately not set up yet. The intended model: frontend and backend behind one
host, with `/` routed to the frontend and `/api` routed to the backend, preserving
the single-origin convention.

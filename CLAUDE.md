# NAJDA — repo guide

Wildfire emergency coordination platform for Algeria. **`docs/` is the product source
of truth — read the relevant module spec in `docs/modules/` before implementing any
feature.** Do not modify `docs/`.

## Layout

- `frontend/` — SolidStart + TypeScript + Tailwind v4, pnpm. Dev server on **3000**.
- `backend/` — cargo workspace; `crates/api` is the Axum binary. Listens on **8080**.
- `backend/migrations/` — plain-SQL sqlx migrations, run automatically at backend startup.
- `docker-compose.dev.yml` — Postgres (PostGIS 16) + Redis 7 for local dev only.
- Production Dockerfiles / compose / Dokploy setup: **not yet created** (deliberate).

## Commands

```sh
cp .env.example .env   # once; every variable is documented there
make infra             # Postgres + Redis containers (Docker required)
make dev               # cargo run + pnpm dev concurrently
make check             # cargo fmt --check, clippy -D warnings, cargo test, pnpm build
make migrate-new name=add_x
```

Backend alone: `cd backend && cargo run -p api`. Frontend alone: `cd frontend && pnpm dev`.
Tests pass without Docker/Postgres/Redis running (they use lazy pools).

## Conventions

- **Single origin `/api`**: the browser always calls relative `/api/...` paths on the
  frontend origin. In dev (and any proxy-less deploy), `frontend/src/routes/api/[...path].ts`
  forwards these to the backend. Server-side code calls the backend directly via
  `API_INTERNAL_URL` (see `frontend/src/lib/api.ts` — use `apiFetch`). Never hardcode
  `localhost:8080` in app code.
- **Backend config from env only**: `PORT` (default 8080), `DATABASE_URL`, `REDIS_URL`
  — parsed in `backend/crates/api/src/config.rs`; the process fails fast at startup if
  Postgres or Redis is unreachable.
- **Shared state**: `AppState { db: PgPool, redis: deadpool_redis::Pool }` in `state.rs`;
  routes live in `routes.rs` behind `router(state)`.
- **sqlx**: use runtime-checked `sqlx::query`/`query_as` — NOT the compile-time macros
  (`query!`) — so builds never need a live database.
- **Migrations**: timestamped `.sql` files in `backend/migrations/`, embedded via
  `sqlx::migrate!` and applied on startup. `wilayas` (58 rows, ar/fr/en names) is the
  first reference table; the product is organized per-wilaya.
- Env vars are documented in `.env.example`; keep it complete when adding variables.

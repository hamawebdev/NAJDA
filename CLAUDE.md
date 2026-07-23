# NAJDA — repo guide

Najda: wildfire emergency coordination platform for Algeria. Six sections only —
Home, Volunteer Groups, Firefighting Volunteers, Resource Volunteers, Affected
Families, Missing Persons. Philosophy: simplicity over complexity; every task done
in under a minute; no accounts except Group Leaders. (The old `docs/` spec was
retired and deleted — the product brief above is the source of truth.)

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
- **Backend config from env only**: `PORT` (default 8080), `DATABASE_URL`, `REDIS_URL`,
  `UPLOAD_DIR` — parsed in `backend/crates/api/src/config.rs`; the process fails fast at
  startup if Postgres or Redis is unreachable.
- **Shared state**: `AppState { db: PgPool, redis: deadpool_redis::Pool, upload_dir }`
  in `state.rs`; `routes.rs` is router assembly only, handlers live in `src/handlers/`.
- **Errors**: handlers return `(StatusCode, String)` where the string is a stable message
  key (e.g. `invalid_phone`) that the frontend maps to translated text (`tError`).
- **i18n**: Arabic (RTL, default) + French. UI strings live in
  `frontend/src/lib/i18n/{ar,fr}.ts`; `ar.ts` defines the key set. Locale persists in
  the `najda_locale` cookie. Use logical Tailwind utilities (`ms-`/`me-`) for RTL.
- **sqlx**: use runtime-checked `sqlx::query`/`query_as` — NOT the compile-time macros
  (`query!`) — so builds never need a live database.
- **Migrations**: timestamped `.sql` files in `backend/migrations/`, embedded via
  `sqlx::migrate!` and applied on startup. `wilayas` (58 rows, ar/fr/en names) is the
  first reference table; the product is organized per-wilaya.
- Env vars are documented in `.env.example`; keep it complete when adding variables.

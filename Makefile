.PHONY: help infra infra-down dev dev-backend dev-frontend migrate-new check ui-setup

help:
	@echo "NAJDA development commands:"
	@echo "  make infra        start Postgres + Redis containers (requires Docker)"
	@echo "  make infra-down   stop them"
	@echo "  make dev          run backend (cargo) and frontend (pnpm) together"
	@echo "  make migrate-new name=add_x   create an empty sqlx migration file"
	@echo "  make check        fmt + clippy + tests + frontend build"
	@echo "  make ui-setup     (re)vendor the solid-ui components into frontend/src/components/ui"

infra:
	docker compose -f docker-compose.dev.yml up -d --wait

infra-down:
	docker compose -f docker-compose.dev.yml down

dev:
	@[ -f .env ] || { echo "No .env found — run: cp .env.example .env"; exit 1; }
	$(MAKE) -j2 dev-backend dev-frontend

dev-backend:
	cd backend && cargo run -p api

# Sources the repo-root .env so API_INTERNAL_URL reaches the frontend server
# (vinxi only reads frontend/.env on its own).
dev-frontend:
	cd frontend && if [ -f ../.env ]; then set -a; . ../.env; set +a; fi; pnpm dev

# Idempotent: leaves existing component files alone. Pass ARGS=--force to reset
# them to upstream, or ARGS=--only=button,card to pull a subset.
ui-setup:
	cd frontend && pnpm ui:setup $(ARGS)

migrate-new:
	@test -n "$(name)" || { echo "usage: make migrate-new name=add_something"; exit 1; }
	@f="backend/migrations/$$(date -u +%Y%m%d%H%M%S)_$(name).sql" && touch "$$f" && echo "created $$f"

check:
	cd backend && cargo fmt --all --check
	cd backend && cargo clippy --all-targets -- -D warnings
	cd backend && cargo test
	cd frontend && pnpm install --frozen-lockfile && pnpm build

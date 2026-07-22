use axum::{Json, Router, extract::State, http::StatusCode, routing::get};
use serde::Serialize;
use tower_http::{cors::CorsLayer, trace::TraceLayer};

use crate::state::AppState;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/api/health", get(health))
        .route("/api/wilayas", get(list_wilayas))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

#[derive(Serialize)]
struct Health {
    status: &'static str,
    postgres: &'static str,
    redis: &'static str,
}

/// Liveness of the API and its two dependencies: runs `SELECT 1` against
/// Postgres and `PING` against Redis. Returns 200 when both are up, 503 with
/// the same JSON shape when either is down.
async fn health(State(state): State<AppState>) -> (StatusCode, Json<Health>) {
    let postgres_ok = sqlx::query("SELECT 1").execute(&state.db).await.is_ok();
    let redis_ok = ping_redis(&state.redis).await;

    let all_ok = postgres_ok && redis_ok;
    let body = Health {
        status: if all_ok { "ok" } else { "degraded" },
        postgres: if postgres_ok { "ok" } else { "error" },
        redis: if redis_ok { "ok" } else { "error" },
    };
    let code = if all_ok {
        StatusCode::OK
    } else {
        StatusCode::SERVICE_UNAVAILABLE
    };
    (code, Json(body))
}

async fn ping_redis(pool: &deadpool_redis::Pool) -> bool {
    let Ok(mut conn) = pool.get().await else {
        return false;
    };
    deadpool_redis::redis::cmd("PING")
        .query_async::<String>(&mut conn)
        .await
        .is_ok()
}

#[derive(Serialize, sqlx::FromRow)]
struct Wilaya {
    code: i16,
    name_ar: String,
    name_fr: String,
    name_en: String,
}

async fn list_wilayas(
    State(state): State<AppState>,
) -> Result<Json<Vec<Wilaya>>, (StatusCode, String)> {
    let wilayas = sqlx::query_as::<_, Wilaya>(
        "SELECT code, name_ar, name_fr, name_en FROM wilayas ORDER BY code",
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| {
        tracing::error!("failed to load wilayas: {e}");
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            "failed to load wilayas".to_string(),
        )
    })?;
    Ok(Json(wilayas))
}

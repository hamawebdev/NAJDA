use std::time::Duration;

use api::{config::Config, routes, state::AppState};
use sqlx::postgres::PgPoolOptions;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")),
        )
        .init();

    if let Err(err) = run().await {
        tracing::error!("{err}");
        std::process::exit(1);
    }
}

async fn run() -> Result<(), String> {
    let config = Config::from_env()?;

    let db = PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(5))
        .connect(&config.database_url)
        .await
        .map_err(|e| format!("cannot connect to Postgres ({}): {e}", config.database_url))?;

    sqlx::migrate!("../../migrations")
        .run(&db)
        .await
        .map_err(|e| format!("failed to run database migrations: {e}"))?;

    let redis = deadpool_redis::Config::from_url(&config.redis_url)
        .create_pool(Some(deadpool_redis::Runtime::Tokio1))
        .map_err(|e| format!("invalid REDIS_URL ({}): {e}", config.redis_url))?;
    // deadpool connects lazily, so ping once here to fail fast on a bad Redis.
    let mut conn = redis
        .get()
        .await
        .map_err(|e| format!("cannot connect to Redis ({}): {e}", config.redis_url))?;
    deadpool_redis::redis::cmd("PING")
        .query_async::<String>(&mut conn)
        .await
        .map_err(|e| format!("Redis PING failed: {e}"))?;
    drop(conn);

    let app = routes::router(AppState { db, redis });

    let addr = format!("0.0.0.0:{}", config.port);
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .map_err(|e| format!("cannot bind {addr}: {e}"))?;
    tracing::info!("NAJDA API listening on http://{addr}");
    axum::serve(listener, app)
        .await
        .map_err(|e| format!("server error: {e}"))?;
    Ok(())
}

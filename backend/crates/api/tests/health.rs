use api::{routes::router, state::AppState};
use axum::{
    body::Body,
    http::{Request, StatusCode},
};
use http_body_util::BodyExt;
use sqlx::postgres::PgPoolOptions;
use tower::ServiceExt;

/// Pools pointing at ports where nothing listens. Both pools are created
/// lazily, so building the state needs no running services — the health
/// handler then reports both dependencies as "error".
fn state_without_backends() -> AppState {
    let db = PgPoolOptions::new()
        .acquire_timeout(std::time::Duration::from_secs(1))
        .connect_lazy("postgres://najda:najda@127.0.0.1:1/najda")
        .expect("lazy pg pool");
    let redis = deadpool_redis::Config::from_url("redis://127.0.0.1:1")
        .create_pool(Some(deadpool_redis::Runtime::Tokio1))
        .expect("lazy redis pool");
    AppState {
        db,
        redis,
        upload_dir: std::env::temp_dir(),
    }
}

#[tokio::test]
async fn health_has_expected_shape_and_degrades_without_backends() {
    let app = router(state_without_backends());

    let response = app
        .oneshot(
            Request::builder()
                .uri("/api/health")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::SERVICE_UNAVAILABLE);

    let body = response.into_body().collect().await.unwrap().to_bytes();
    let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
    assert_eq!(json["status"], "degraded");
    assert_eq!(json["postgres"], "error");
    assert_eq!(json["redis"], "error");
}

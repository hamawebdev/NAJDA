//! Request-validation tests that need no running Postgres or Redis: field
//! validation runs before any database access, and the leader auth helper
//! checks the cookie before touching Redis.

use api::{routes::router, state::AppState};
use axum::{
    body::Body,
    http::{Request, StatusCode, header},
};
use http_body_util::BodyExt;
use sqlx::postgres::PgPoolOptions;
use tower::ServiceExt;

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

async fn post_json(path: &str, body: &str) -> (StatusCode, String) {
    let app = router(state_without_backends());
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(path)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    let status = response.status();
    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    (status, String::from_utf8_lossy(&bytes).to_string())
}

#[tokio::test]
async fn volunteer_with_bad_phone_is_rejected() {
    let (status, body) = post_json(
        "/api/volunteers",
        r#"{"first_name":"Amine","last_name":"B","phone":"12345","wilaya_code":16,"commune_id":1}"#,
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body, "invalid_phone");
}

#[tokio::test]
async fn volunteer_with_empty_name_is_rejected() {
    let (status, body) = post_json(
        "/api/volunteers",
        r#"{"first_name":"  ","last_name":"B","phone":"0550123456","wilaya_code":16,"commune_id":1}"#,
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body, "invalid_first_name");
}

#[tokio::test]
async fn group_with_short_password_is_rejected() {
    let (status, body) = post_json(
        "/api/groups",
        r#"{"name":"Najda Tizi","leader_first_name":"A","leader_last_name":"B",
            "leader_phone":"0550123456","password":"123","wilaya_code":15,"commune_id":1}"#,
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body, "password_too_short");
}

#[tokio::test]
async fn resource_offer_with_unknown_category_is_rejected() {
    let (status, body) = post_json(
        "/api/resources",
        r#"{"full_name":"A B","phone":"0550123456","wilaya_code":16,"commune_id":1,
            "categories":["water","helicopters"]}"#,
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body, "invalid_category");
}

#[tokio::test]
async fn resource_offer_without_categories_is_rejected() {
    let (status, body) = post_json(
        "/api/resources",
        r#"{"full_name":"A B","phone":"0550123456","wilaya_code":16,"commune_id":1,"categories":[]}"#,
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body, "invalid_category");
}

#[tokio::test]
async fn help_request_with_bad_phone_is_rejected() {
    let (status, body) = post_json(
        "/api/help-requests",
        r#"{"full_name":"A B","phone":"phone","wilaya_code":16,"commune_id":1,"needs":"water"}"#,
    )
    .await;
    assert_eq!(status, StatusCode::BAD_REQUEST);
    assert_eq!(body, "invalid_phone");
}

#[tokio::test]
async fn join_without_volunteer_token_is_unauthorized() {
    let app = router(state_without_backends());
    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/groups/1/join")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::UNAUTHORIZED);
}

#[tokio::test]
async fn leader_endpoints_without_cookie_are_unauthorized() {
    for (method, path) in [
        ("GET", "/api/leader/me"),
        ("GET", "/api/leader/notifications"),
        ("POST", "/api/leader/notifications/read"),
    ] {
        let app = router(state_without_backends());
        let response = app
            .oneshot(
                Request::builder()
                    .method(method)
                    .uri(path)
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();
        assert_eq!(
            response.status(),
            StatusCode::UNAUTHORIZED,
            "{method} {path}"
        );
    }
}

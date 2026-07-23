use axum::{
    Router,
    extract::DefaultBodyLimit,
    routing::{get, post},
};
use tower_http::{cors::CorsLayer, services::ServeDir, trace::TraceLayer};

use crate::handlers::{
    groups, health, help_requests, leader, locations, missing_persons, resources, volunteers,
};
use crate::state::AppState;

pub fn router(state: AppState) -> Router {
    Router::new()
        .route("/api/health", get(health::health))
        .route("/api/wilayas", get(locations::list_wilayas))
        .route("/api/communes", get(locations::list_communes))
        .route("/api/volunteers", post(volunteers::create))
        .route("/api/groups", get(groups::list).post(groups::create))
        .route("/api/groups/{id}", get(groups::detail))
        .route("/api/groups/{id}/join", post(groups::join))
        .route("/api/leader/login", post(leader::login))
        .route("/api/leader/logout", post(leader::logout))
        .route("/api/leader/me", get(leader::me))
        .route("/api/leader/notifications", get(leader::notifications))
        .route("/api/leader/notifications/read", post(leader::mark_read))
        .route(
            "/api/resources",
            get(resources::list).post(resources::create),
        )
        .route(
            "/api/help-requests",
            get(help_requests::list).post(help_requests::create),
        )
        .route(
            "/api/missing-persons",
            get(missing_persons::list).post(missing_persons::create),
        )
        .nest_service("/api/uploads", ServeDir::new(state.upload_dir.clone()))
        // 6 MB cap: covers the 5 MB photo limit plus multipart overhead.
        .layer(DefaultBodyLimit::max(6 * 1024 * 1024))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http())
        .with_state(state)
}

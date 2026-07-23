//! Shared helpers for request handlers.
//!
//! Errors are `(StatusCode, String)` where the string is a stable message key
//! (e.g. `invalid_phone`) that the frontend maps to a translated string.
//! Field validation runs before any database access so invalid requests fail
//! fast (and validation tests need no running database).

use axum::http::StatusCode;
use sqlx::PgPool;

pub type HandlerError = (StatusCode, String);

pub fn internal(context: &str, err: impl std::fmt::Display) -> HandlerError {
    tracing::error!("{context}: {err}");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        "internal_error".to_string(),
    )
}

pub fn bad_request(key: &str) -> HandlerError {
    (StatusCode::BAD_REQUEST, key.to_string())
}

/// Trimmed, non-empty, length-capped text field.
pub fn require_text(value: &str, max_len: usize, key: &str) -> Result<String, HandlerError> {
    let trimmed = value.trim();
    if trimmed.is_empty() || trimmed.chars().count() > max_len {
        return Err(bad_request(key));
    }
    Ok(trimmed.to_string())
}

/// Optional free text (may be empty), trimmed and length-capped.
pub fn optional_text(value: &str, max_len: usize, key: &str) -> Result<String, HandlerError> {
    let trimmed = value.trim();
    if trimmed.chars().count() > max_len {
        return Err(bad_request(key));
    }
    Ok(trimmed.to_string())
}

/// Normalize a phone field or fail with `invalid_phone`.
pub fn require_phone(value: &str) -> Result<String, HandlerError> {
    crate::phone::normalize(value).ok_or_else(|| bad_request("invalid_phone"))
}

/// The commune must exist and belong to the given wilaya.
pub async fn validate_location(
    db: &PgPool,
    wilaya_code: i16,
    commune_id: i32,
) -> Result<(), HandlerError> {
    let found = sqlx::query("SELECT 1 FROM communes WHERE id = $1 AND wilaya_code = $2")
        .bind(commune_id)
        .bind(wilaya_code)
        .fetch_optional(db)
        .await
        .map_err(|e| internal("validate location", e))?;
    match found {
        Some(_) => Ok(()),
        None => Err(bad_request("invalid_location")),
    }
}

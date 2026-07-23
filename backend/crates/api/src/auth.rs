//! Group-leader sessions and password hashing.
//!
//! Sessions are opaque tokens stored in Redis (`session:{token}` → group id)
//! and carried in an HttpOnly cookie. Password hashes are Argon2id PHC
//! strings; hashing/verification runs on the blocking thread pool.

use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier, password_hash::SaltString};
use axum::http::StatusCode;
use axum_extra::extract::cookie::{Cookie, CookieJar, SameSite};
use deadpool_redis::Pool as RedisPool;
use rand_core::OsRng;

pub const SESSION_COOKIE: &str = "najda_session";
const SESSION_TTL_SECS: i64 = 30 * 24 * 60 * 60;

type HandlerError = (StatusCode, String);

fn internal(context: &str, err: impl std::fmt::Display) -> HandlerError {
    tracing::error!("{context}: {err}");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        "internal_error".to_string(),
    )
}

fn session_key(token: &str) -> String {
    format!("session:{token}")
}

/// Create a session for a group leader and return the opaque token.
pub async fn create_session(redis: &RedisPool, group_id: i64) -> Result<String, HandlerError> {
    let token = uuid::Uuid::new_v4().simple().to_string();
    let mut conn = redis.get().await.map_err(|e| internal("redis pool", e))?;
    deadpool_redis::redis::cmd("SET")
        .arg(session_key(&token))
        .arg(group_id)
        .arg("EX")
        .arg(SESSION_TTL_SECS)
        .query_async::<()>(&mut conn)
        .await
        .map_err(|e| internal("store session", e))?;
    Ok(token)
}

/// The session cookie for a freshly created token. The cookie is long-lived;
/// the Redis TTL (30 days) is what actually expires the session. No `Secure`
/// flag here: local dev is plain HTTP; a TLS-terminating proxy adds it in prod.
pub fn session_cookie(token: String) -> Cookie<'static> {
    Cookie::build((SESSION_COOKIE, token))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .permanent()
        .build()
}

/// An expired cookie that clears the session on the client.
pub fn removal_cookie() -> Cookie<'static> {
    let mut cookie = Cookie::build((SESSION_COOKIE, ""))
        .path("/")
        .http_only(true)
        .same_site(SameSite::Lax)
        .build();
    cookie.make_removal();
    cookie
}

/// Resolve the leader session to a group id. Checks the cookie before
/// touching Redis so unauthenticated requests fail fast (and tests need no
/// running Redis).
pub async fn leader_group_id(jar: &CookieJar, redis: &RedisPool) -> Result<i64, HandlerError> {
    let Some(cookie) = jar.get(SESSION_COOKIE) else {
        return Err((StatusCode::UNAUTHORIZED, "not_logged_in".to_string()));
    };
    let mut conn = redis.get().await.map_err(|e| internal("redis pool", e))?;
    let group_id: Option<i64> = deadpool_redis::redis::cmd("GET")
        .arg(session_key(cookie.value()))
        .query_async(&mut conn)
        .await
        .map_err(|e| internal("read session", e))?;
    group_id.ok_or((StatusCode::UNAUTHORIZED, "not_logged_in".to_string()))
}

/// Delete the session referenced by the cookie, if any.
pub async fn delete_session(jar: &CookieJar, redis: &RedisPool) -> Result<(), HandlerError> {
    let Some(cookie) = jar.get(SESSION_COOKIE) else {
        return Ok(());
    };
    let mut conn = redis.get().await.map_err(|e| internal("redis pool", e))?;
    deadpool_redis::redis::cmd("DEL")
        .arg(session_key(cookie.value()))
        .query_async::<()>(&mut conn)
        .await
        .map_err(|e| internal("delete session", e))?;
    Ok(())
}

/// Argon2id-hash a password on the blocking pool.
pub async fn hash_password(password: String) -> Result<String, HandlerError> {
    tokio::task::spawn_blocking(move || {
        let salt = SaltString::generate(&mut OsRng);
        Argon2::default()
            .hash_password(password.as_bytes(), &salt)
            .map(|hash| hash.to_string())
    })
    .await
    .map_err(|e| internal("join hash task", e))?
    .map_err(|e| internal("hash password", e))
}

/// Verify a password against a stored PHC hash on the blocking pool.
pub async fn verify_password(password: String, hash: String) -> Result<bool, HandlerError> {
    tokio::task::spawn_blocking(move || {
        let Ok(parsed) = PasswordHash::new(&hash) else {
            return false;
        };
        Argon2::default()
            .verify_password(password.as_bytes(), &parsed)
            .is_ok()
    })
    .await
    .map_err(|e| internal("join verify task", e))
}

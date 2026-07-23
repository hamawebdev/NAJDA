use axum::{Json, extract::State, http::StatusCode};
use axum_extra::extract::cookie::CookieJar;
use serde::{Deserialize, Serialize};

use super::common::{HandlerError, internal, require_phone};
use crate::{auth, state::AppState};

#[derive(Deserialize)]
pub struct Login {
    phone: String,
    password: String,
}

#[derive(Serialize)]
pub struct LoggedIn {
    group_id: i64,
}

pub async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(body): Json<Login>,
) -> Result<(CookieJar, Json<LoggedIn>), HandlerError> {
    let phone = require_phone(&body.phone)?;

    let row: Option<(i64, String)> =
        sqlx::query_as("SELECT id, password_hash FROM groups WHERE leader_phone = $1")
            .bind(&phone)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| internal("load leader", e))?;

    // Same error for unknown phone and wrong password.
    let invalid = || (StatusCode::UNAUTHORIZED, "invalid_credentials".to_string());
    let Some((group_id, password_hash)) = row else {
        return Err(invalid());
    };
    if !auth::verify_password(body.password, password_hash).await? {
        return Err(invalid());
    }

    let token = auth::create_session(&state.redis, group_id).await?;
    Ok((
        jar.add(auth::session_cookie(token)),
        Json(LoggedIn { group_id }),
    ))
}

pub async fn logout(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<(CookieJar, StatusCode), HandlerError> {
    auth::delete_session(&jar, &state.redis).await?;
    Ok((jar.add(auth::removal_cookie()), StatusCode::NO_CONTENT))
}

#[derive(Serialize, sqlx::FromRow)]
pub struct OwnGroup {
    id: i64,
    name: String,
    leader_first_name: String,
    leader_last_name: String,
    leader_phone: String,
    wilaya_code: i16,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_id: i32,
    commune_name_ar: String,
    commune_name_fr: String,
    neighborhood: String,
    member_count: i64,
}

#[derive(Serialize)]
pub struct Me {
    group: OwnGroup,
    unread_notifications: i64,
}

/// Dashboard bootstrap: the leader's own group plus the unread-join count.
pub async fn me(State(state): State<AppState>, jar: CookieJar) -> Result<Json<Me>, HandlerError> {
    let group_id = auth::leader_group_id(&jar, &state.redis).await?;

    let group = sqlx::query_as::<_, OwnGroup>(
        "SELECT g.id, g.name, g.leader_first_name, g.leader_last_name, g.leader_phone,
                g.wilaya_code, w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                g.commune_id, c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                g.neighborhood,
                (SELECT COUNT(*) FROM group_members m WHERE m.group_id = g.id) AS member_count
         FROM groups g
         JOIN wilayas w ON w.code = g.wilaya_code
         JOIN communes c ON c.id = g.commune_id
         WHERE g.id = $1",
    )
    .bind(group_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| internal("load own group", e))?
    .ok_or((StatusCode::UNAUTHORIZED, "not_logged_in".to_string()))?;

    let (unread_notifications,): (i64,) =
        sqlx::query_as("SELECT COUNT(*) FROM group_notifications WHERE group_id = $1 AND NOT read")
            .bind(group_id)
            .fetch_one(&state.db)
            .await
            .map_err(|e| internal("count unread", e))?;

    Ok(Json(Me {
        group,
        unread_notifications,
    }))
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Notification {
    id: i64,
    read: bool,
    created_at: i64,
    first_name: String,
    last_name: String,
    phone: String,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_name_ar: String,
    commune_name_fr: String,
    neighborhood: String,
}

/// Join notifications, newest first. Polled by the leader dashboard.
pub async fn notifications(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<Json<Vec<Notification>>, HandlerError> {
    let group_id = auth::leader_group_id(&jar, &state.redis).await?;

    let notifications = sqlx::query_as::<_, Notification>(
        "SELECT n.id, n.read, EXTRACT(EPOCH FROM n.created_at)::BIGINT AS created_at,
                v.first_name, v.last_name, v.phone,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                v.neighborhood
         FROM group_notifications n
         JOIN volunteers v ON v.id = n.volunteer_id
         JOIN wilayas w ON w.code = v.wilaya_code
         JOIN communes c ON c.id = v.commune_id
         WHERE n.group_id = $1
         ORDER BY n.created_at DESC LIMIT 200",
    )
    .bind(group_id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("load notifications", e))?;

    Ok(Json(notifications))
}

pub async fn mark_read(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<StatusCode, HandlerError> {
    let group_id = auth::leader_group_id(&jar, &state.redis).await?;

    sqlx::query("UPDATE group_notifications SET read = TRUE WHERE group_id = $1 AND NOT read")
        .bind(group_id)
        .execute(&state.db)
        .await
        .map_err(|e| internal("mark notifications read", e))?;

    Ok(StatusCode::NO_CONTENT)
}

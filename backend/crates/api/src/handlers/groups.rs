use axum::{
    Json,
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
};
use axum_extra::extract::cookie::CookieJar;
use serde::{Deserialize, Serialize};

use super::common::{
    HandlerError, bad_request, internal, optional_text, require_phone, require_text,
    validate_location,
};
use crate::{auth, state::AppState};

pub const VOLUNTEER_TOKEN_HEADER: &str = "x-volunteer-token";

#[derive(Serialize, sqlx::FromRow)]
pub struct GroupSummary {
    id: i64,
    name: String,
    leader_first_name: String,
    wilaya_code: i16,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_id: i32,
    commune_name_ar: String,
    commune_name_fr: String,
    neighborhood: String,
    created_at: i64,
    member_count: i64,
}

#[derive(Deserialize)]
pub struct GroupFilter {
    wilaya: Option<i16>,
    commune: Option<i32>,
    neighborhood: Option<String>,
}

/// Public browse list: no phone numbers, member count included.
pub async fn list(
    State(state): State<AppState>,
    Query(filter): Query<GroupFilter>,
) -> Result<Json<Vec<GroupSummary>>, HandlerError> {
    let neighborhood = filter
        .neighborhood
        .as_deref()
        .map(str::trim)
        .filter(|s| !s.is_empty());
    let groups = sqlx::query_as::<_, GroupSummary>(
        "SELECT g.id, g.name, g.leader_first_name, g.wilaya_code,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                g.commune_id, c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                g.neighborhood, EXTRACT(EPOCH FROM g.created_at)::BIGINT AS created_at,
                (SELECT COUNT(*) FROM group_members m WHERE m.group_id = g.id) AS member_count
         FROM groups g
         JOIN wilayas w ON w.code = g.wilaya_code
         JOIN communes c ON c.id = g.commune_id
         WHERE ($1::smallint IS NULL OR g.wilaya_code = $1)
           AND ($2::integer IS NULL OR g.commune_id = $2)
           AND ($3::text IS NULL OR g.neighborhood ILIKE '%' || $3 || '%')
         ORDER BY g.created_at DESC LIMIT 200",
    )
    .bind(filter.wilaya)
    .bind(filter.commune)
    .bind(neighborhood)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("list groups", e))?;
    Ok(Json(groups))
}

#[derive(Deserialize)]
pub struct NewGroup {
    name: String,
    leader_first_name: String,
    leader_last_name: String,
    leader_phone: String,
    password: String,
    wilaya_code: i16,
    commune_id: i32,
    #[serde(default)]
    neighborhood: String,
}

#[derive(Serialize)]
pub struct CreatedGroup {
    id: i64,
}

/// Create a group (leader account). Logs the leader in immediately.
pub async fn create(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(body): Json<NewGroup>,
) -> Result<(CookieJar, Json<CreatedGroup>), HandlerError> {
    let name = require_text(&body.name, 150, "invalid_group_name")?;
    let first_name = require_text(&body.leader_first_name, 100, "invalid_first_name")?;
    let last_name = require_text(&body.leader_last_name, 100, "invalid_last_name")?;
    let phone = require_phone(&body.leader_phone)?;
    if body.password.chars().count() < 6 || body.password.chars().count() > 128 {
        return Err(bad_request("password_too_short"));
    }
    let neighborhood = optional_text(&body.neighborhood, 200, "invalid_neighborhood")?;
    validate_location(&state.db, body.wilaya_code, body.commune_id).await?;

    let password_hash = auth::hash_password(body.password).await?;
    let inserted: Result<(i64,), sqlx::Error> = sqlx::query_as(
        "INSERT INTO groups (name, leader_first_name, leader_last_name, leader_phone,
                             password_hash, wilaya_code, commune_id, neighborhood)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    )
    .bind(&name)
    .bind(&first_name)
    .bind(&last_name)
    .bind(&phone)
    .bind(&password_hash)
    .bind(body.wilaya_code)
    .bind(body.commune_id)
    .bind(&neighborhood)
    .fetch_one(&state.db)
    .await;

    let id = match inserted {
        Ok((id,)) => id,
        // 23505 = unique_violation: this phone already leads a group.
        Err(e) if e.as_database_error().and_then(|d| d.code()).as_deref() == Some("23505") => {
            return Err((StatusCode::CONFLICT, "phone_already_used".to_string()));
        }
        Err(e) => return Err(internal("create group", e)),
    };

    let token = auth::create_session(&state.redis, id).await?;
    Ok((
        jar.add(auth::session_cookie(token)),
        Json(CreatedGroup { id }),
    ))
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Member {
    first_name: String,
    last_name: String,
    phone: String,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_name_ar: String,
    commune_name_fr: String,
    neighborhood: String,
    joined_at: i64,
}

#[derive(Serialize)]
pub struct GroupDetail {
    #[serde(flatten)]
    summary: GroupSummary,
    /// "public" | "member" | "leader" — what this viewer is allowed to see.
    viewer: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    leader_phone: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    leader_last_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    members: Option<Vec<Member>>,
}

/// Group page. Public shape by default; a member of this group (via
/// `X-Volunteer-Token`) or its leader (via session cookie) also gets the
/// leader's phone and the full member list with contact details.
pub async fn detail(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    jar: CookieJar,
    headers: HeaderMap,
) -> Result<Json<GroupDetail>, HandlerError> {
    let summary = sqlx::query_as::<_, GroupSummary>(
        "SELECT g.id, g.name, g.leader_first_name, g.wilaya_code,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                g.commune_id, c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                g.neighborhood, EXTRACT(EPOCH FROM g.created_at)::BIGINT AS created_at,
                (SELECT COUNT(*) FROM group_members m WHERE m.group_id = g.id) AS member_count
         FROM groups g
         JOIN wilayas w ON w.code = g.wilaya_code
         JOIN communes c ON c.id = g.commune_id
         WHERE g.id = $1",
    )
    .bind(id)
    .fetch_optional(&state.db)
    .await
    .map_err(|e| internal("load group", e))?
    .ok_or((StatusCode::NOT_FOUND, "group_not_found".to_string()))?;

    let is_leader = matches!(
        auth::leader_group_id(&jar, &state.redis).await,
        Ok(group_id) if group_id == id
    );
    let is_member = if is_leader {
        false
    } else {
        match volunteer_token(&headers) {
            Some(token) => sqlx::query(
                "SELECT 1 FROM group_members m
                 JOIN volunteers v ON v.id = m.volunteer_id
                 WHERE m.group_id = $1 AND v.token = $2",
            )
            .bind(id)
            .bind(token)
            .fetch_optional(&state.db)
            .await
            .map_err(|e| internal("check membership", e))?
            .is_some(),
            None => false,
        }
    };

    if !is_leader && !is_member {
        return Ok(Json(GroupDetail {
            summary,
            viewer: "public",
            leader_phone: None,
            leader_last_name: None,
            members: None,
        }));
    }

    let (leader_phone, leader_last_name): (String, String) =
        sqlx::query_as("SELECT leader_phone, leader_last_name FROM groups WHERE id = $1")
            .bind(id)
            .fetch_one(&state.db)
            .await
            .map_err(|e| internal("load leader contact", e))?;

    let members = sqlx::query_as::<_, Member>(
        "SELECT v.first_name, v.last_name, v.phone,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                v.neighborhood, EXTRACT(EPOCH FROM m.joined_at)::BIGINT AS joined_at
         FROM group_members m
         JOIN volunteers v ON v.id = m.volunteer_id
         JOIN wilayas w ON w.code = v.wilaya_code
         JOIN communes c ON c.id = v.commune_id
         WHERE m.group_id = $1
         ORDER BY m.joined_at DESC",
    )
    .bind(id)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("load members", e))?;

    Ok(Json(GroupDetail {
        summary,
        viewer: if is_leader { "leader" } else { "member" },
        leader_phone: Some(leader_phone),
        leader_last_name: Some(leader_last_name),
        members: Some(members),
    }))
}

#[derive(Serialize)]
pub struct Joined {
    joined: bool,
}

/// Join a group instantly with a volunteer token. Idempotent: re-joining is a
/// no-op and does not notify the leader again.
pub async fn join(
    State(state): State<AppState>,
    Path(id): Path<i64>,
    headers: HeaderMap,
) -> Result<Json<Joined>, HandlerError> {
    let Some(token) = volunteer_token(&headers) else {
        return Err((StatusCode::UNAUTHORIZED, "invalid_token".to_string()));
    };

    let volunteer: Option<(i64,)> = sqlx::query_as("SELECT id FROM volunteers WHERE token = $1")
        .bind(token)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| internal("resolve volunteer", e))?;
    let Some((volunteer_id,)) = volunteer else {
        return Err((StatusCode::UNAUTHORIZED, "invalid_token".to_string()));
    };

    let group: Option<(i64,)> = sqlx::query_as("SELECT id FROM groups WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.db)
        .await
        .map_err(|e| internal("load group", e))?;
    if group.is_none() {
        return Err((StatusCode::NOT_FOUND, "group_not_found".to_string()));
    }

    let mut tx = state
        .db
        .begin()
        .await
        .map_err(|e| internal("begin join", e))?;
    let inserted = sqlx::query(
        "INSERT INTO group_members (group_id, volunteer_id) VALUES ($1, $2)
         ON CONFLICT DO NOTHING",
    )
    .bind(id)
    .bind(volunteer_id)
    .execute(&mut *tx)
    .await
    .map_err(|e| internal("join group", e))?;
    if inserted.rows_affected() == 1 {
        sqlx::query("INSERT INTO group_notifications (group_id, volunteer_id) VALUES ($1, $2)")
            .bind(id)
            .bind(volunteer_id)
            .execute(&mut *tx)
            .await
            .map_err(|e| internal("notify leader", e))?;
    }
    tx.commit().await.map_err(|e| internal("commit join", e))?;

    Ok(Json(Joined { joined: true }))
}

fn volunteer_token(headers: &HeaderMap) -> Option<&str> {
    headers
        .get(VOLUNTEER_TOKEN_HEADER)
        .and_then(|v| v.to_str().ok())
        .map(str::trim)
        .filter(|v| !v.is_empty())
}

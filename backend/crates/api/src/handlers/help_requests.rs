use axum::{
    Json,
    extract::{Query, State},
};
use serde::{Deserialize, Serialize};

use super::common::{
    HandlerError, internal, optional_text, require_phone, require_text, validate_location,
};
use crate::state::AppState;

#[derive(Deserialize)]
pub struct WilayaFilter {
    wilaya: Option<i16>,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct HelpRequest {
    id: i64,
    full_name: String,
    phone: String,
    wilaya_code: i16,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_name_ar: String,
    commune_name_fr: String,
    neighborhood: String,
    needs: String,
    created_at: i64,
}

pub async fn list(
    State(state): State<AppState>,
    Query(filter): Query<WilayaFilter>,
) -> Result<Json<Vec<HelpRequest>>, HandlerError> {
    let requests = sqlx::query_as::<_, HelpRequest>(
        "SELECT h.id, h.full_name, h.phone, h.wilaya_code,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                h.neighborhood, h.needs,
                EXTRACT(EPOCH FROM h.created_at)::BIGINT AS created_at
         FROM help_requests h
         JOIN wilayas w ON w.code = h.wilaya_code
         JOIN communes c ON c.id = h.commune_id
         WHERE ($1::smallint IS NULL OR h.wilaya_code = $1)
         ORDER BY h.created_at DESC LIMIT 200",
    )
    .bind(filter.wilaya)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("list help requests", e))?;
    Ok(Json(requests))
}

#[derive(Deserialize)]
pub struct NewRequest {
    full_name: String,
    phone: String,
    wilaya_code: i16,
    commune_id: i32,
    #[serde(default)]
    neighborhood: String,
    needs: String,
}

#[derive(Serialize)]
pub struct Created {
    id: i64,
}

pub async fn create(
    State(state): State<AppState>,
    Json(body): Json<NewRequest>,
) -> Result<Json<Created>, HandlerError> {
    let full_name = require_text(&body.full_name, 150, "invalid_full_name")?;
    let phone = require_phone(&body.phone)?;
    let neighborhood = optional_text(&body.neighborhood, 200, "invalid_neighborhood")?;
    let needs = require_text(&body.needs, 2000, "invalid_needs")?;
    validate_location(&state.db, body.wilaya_code, body.commune_id).await?;

    let (id,): (i64,) = sqlx::query_as(
        "INSERT INTO help_requests (full_name, phone, wilaya_code, commune_id, neighborhood, needs)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
    )
    .bind(&full_name)
    .bind(&phone)
    .bind(body.wilaya_code)
    .bind(body.commune_id)
    .bind(&neighborhood)
    .bind(&needs)
    .fetch_one(&state.db)
    .await
    .map_err(|e| internal("create help request", e))?;

    Ok(Json(Created { id }))
}

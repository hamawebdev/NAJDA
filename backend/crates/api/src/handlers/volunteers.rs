use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};

use super::common::{
    HandlerError, internal, optional_text, require_phone, require_text, validate_location,
};
use crate::state::AppState;

#[derive(Deserialize)]
pub struct NewVolunteer {
    first_name: String,
    last_name: String,
    phone: String,
    wilaya_code: i16,
    commune_id: i32,
    #[serde(default)]
    neighborhood: String,
}

#[derive(Serialize)]
pub struct CreatedVolunteer {
    id: i64,
    /// Opaque secret the browser stores and presents as `X-Volunteer-Token`.
    token: String,
}

/// Register a firefighting volunteer — no account, five fields plus location.
pub async fn create(
    State(state): State<AppState>,
    Json(body): Json<NewVolunteer>,
) -> Result<Json<CreatedVolunteer>, HandlerError> {
    let first_name = require_text(&body.first_name, 100, "invalid_first_name")?;
    let last_name = require_text(&body.last_name, 100, "invalid_last_name")?;
    let phone = require_phone(&body.phone)?;
    let neighborhood = optional_text(&body.neighborhood, 200, "invalid_neighborhood")?;
    validate_location(&state.db, body.wilaya_code, body.commune_id).await?;

    let token = uuid::Uuid::new_v4().simple().to_string();
    let (id,): (i64,) = sqlx::query_as(
        "INSERT INTO volunteers (token, first_name, last_name, phone, wilaya_code, commune_id, neighborhood)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    )
    .bind(&token)
    .bind(&first_name)
    .bind(&last_name)
    .bind(&phone)
    .bind(body.wilaya_code)
    .bind(body.commune_id)
    .bind(&neighborhood)
    .fetch_one(&state.db)
    .await
    .map_err(|e| internal("create volunteer", e))?;

    Ok(Json(CreatedVolunteer { id, token }))
}

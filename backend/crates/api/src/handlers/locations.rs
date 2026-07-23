use axum::{
    Json,
    extract::{Query, State},
};
use serde::{Deserialize, Serialize};

use super::common::{HandlerError, internal};
use crate::state::AppState;

#[derive(Serialize, sqlx::FromRow)]
pub struct Wilaya {
    code: i16,
    name_ar: String,
    name_fr: String,
    name_en: String,
}

pub async fn list_wilayas(
    State(state): State<AppState>,
) -> Result<Json<Vec<Wilaya>>, HandlerError> {
    let wilayas = sqlx::query_as::<_, Wilaya>(
        "SELECT code, name_ar, name_fr, name_en FROM wilayas ORDER BY code",
    )
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("load wilayas", e))?;
    Ok(Json(wilayas))
}

#[derive(Deserialize)]
pub struct CommuneFilter {
    wilaya: i16,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct Commune {
    id: i32,
    wilaya_code: i16,
    name_ar: String,
    name_fr: String,
}

/// Communes of one wilaya, for the cascading wilaya → municipality select.
pub async fn list_communes(
    State(state): State<AppState>,
    Query(filter): Query<CommuneFilter>,
) -> Result<Json<Vec<Commune>>, HandlerError> {
    let communes = sqlx::query_as::<_, Commune>(
        "SELECT id, wilaya_code, name_ar, name_fr FROM communes
         WHERE wilaya_code = $1 ORDER BY name_fr",
    )
    .bind(filter.wilaya)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("load communes", e))?;
    Ok(Json(communes))
}

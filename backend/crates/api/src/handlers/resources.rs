use axum::{
    Json,
    extract::{Query, State},
};
use serde::{Deserialize, Serialize};

use super::common::{
    HandlerError, bad_request, internal, optional_text, require_phone, require_text,
    validate_location,
};
use crate::state::AppState;

/// Canonical category slugs; the UI translates them. Validated here rather
/// than with a DB CHECK so adding a category never needs a migration.
pub const CATEGORIES: [&str; 11] = [
    "water",
    "food",
    "medicine",
    "blankets",
    "clothing",
    "fuel",
    "generators",
    "transportation",
    "firefighting_equipment",
    "first_aid",
    "other",
];

#[derive(Deserialize)]
pub struct WilayaFilter {
    wilaya: Option<i16>,
}

#[derive(Serialize, sqlx::FromRow)]
pub struct ResourceOffer {
    id: i64,
    full_name: String,
    phone: String,
    wilaya_code: i16,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_name_ar: String,
    commune_name_fr: String,
    neighborhood: String,
    categories: Vec<String>,
    details: String,
    created_at: i64,
}

pub async fn list(
    State(state): State<AppState>,
    Query(filter): Query<WilayaFilter>,
) -> Result<Json<Vec<ResourceOffer>>, HandlerError> {
    let offers = sqlx::query_as::<_, ResourceOffer>(
        "SELECT r.id, r.full_name, r.phone, r.wilaya_code,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                r.neighborhood, r.categories, r.details,
                EXTRACT(EPOCH FROM r.created_at)::BIGINT AS created_at
         FROM resource_offers r
         JOIN wilayas w ON w.code = r.wilaya_code
         JOIN communes c ON c.id = r.commune_id
         WHERE ($1::smallint IS NULL OR r.wilaya_code = $1)
         ORDER BY r.created_at DESC LIMIT 200",
    )
    .bind(filter.wilaya)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("list resource offers", e))?;
    Ok(Json(offers))
}

#[derive(Deserialize)]
pub struct NewOffer {
    full_name: String,
    phone: String,
    wilaya_code: i16,
    commune_id: i32,
    #[serde(default)]
    neighborhood: String,
    categories: Vec<String>,
    #[serde(default)]
    details: String,
}

#[derive(Serialize)]
pub struct Created {
    id: i64,
}

pub async fn create(
    State(state): State<AppState>,
    Json(body): Json<NewOffer>,
) -> Result<Json<Created>, HandlerError> {
    let full_name = require_text(&body.full_name, 150, "invalid_full_name")?;
    let phone = require_phone(&body.phone)?;
    let neighborhood = optional_text(&body.neighborhood, 200, "invalid_neighborhood")?;
    let details = optional_text(&body.details, 2000, "invalid_details")?;

    let mut categories: Vec<String> = Vec::new();
    for category in &body.categories {
        if !CATEGORIES.contains(&category.as_str()) {
            return Err(bad_request("invalid_category"));
        }
        if !categories.contains(category) {
            categories.push(category.clone());
        }
    }
    if categories.is_empty() {
        return Err(bad_request("invalid_category"));
    }

    validate_location(&state.db, body.wilaya_code, body.commune_id).await?;

    let (id,): (i64,) = sqlx::query_as(
        "INSERT INTO resource_offers (full_name, phone, wilaya_code, commune_id, neighborhood, categories, details)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
    )
    .bind(&full_name)
    .bind(&phone)
    .bind(body.wilaya_code)
    .bind(body.commune_id)
    .bind(&neighborhood)
    .bind(&categories)
    .bind(&details)
    .fetch_one(&state.db)
    .await
    .map_err(|e| internal("create resource offer", e))?;

    Ok(Json(Created { id }))
}

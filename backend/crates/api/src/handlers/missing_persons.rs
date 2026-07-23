use axum::{
    Json,
    extract::{Multipart, Query, State},
};
use serde::{Deserialize, Serialize};

use super::common::{
    HandlerError, bad_request, internal, optional_text, require_phone, require_text,
    validate_location,
};
use crate::state::AppState;

const MAX_PHOTO_BYTES: usize = 5 * 1024 * 1024;

#[derive(Deserialize)]
pub struct WilayaFilter {
    wilaya: Option<i16>,
}

#[derive(sqlx::FromRow)]
struct Row {
    id: i64,
    first_name: String,
    last_name: String,
    photo_path: Option<String>,
    wilaya_code: i16,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_name_ar: String,
    commune_name_fr: String,
    last_seen_details: String,
    description: String,
    contact_phone: String,
    created_at: i64,
}

#[derive(Serialize)]
pub struct MissingPerson {
    id: i64,
    first_name: String,
    last_name: String,
    photo_url: Option<String>,
    wilaya_code: i16,
    wilaya_name_ar: String,
    wilaya_name_fr: String,
    commune_name_ar: String,
    commune_name_fr: String,
    last_seen_details: String,
    description: String,
    contact_phone: String,
    created_at: i64,
}

pub async fn list(
    State(state): State<AppState>,
    Query(filter): Query<WilayaFilter>,
) -> Result<Json<Vec<MissingPerson>>, HandlerError> {
    let rows = sqlx::query_as::<_, Row>(
        "SELECT p.id, p.first_name, p.last_name, p.photo_path, p.wilaya_code,
                w.name_ar AS wilaya_name_ar, w.name_fr AS wilaya_name_fr,
                c.name_ar AS commune_name_ar, c.name_fr AS commune_name_fr,
                p.last_seen_details, p.description, p.contact_phone,
                EXTRACT(EPOCH FROM p.created_at)::BIGINT AS created_at
         FROM missing_persons p
         JOIN wilayas w ON w.code = p.wilaya_code
         JOIN communes c ON c.id = p.commune_id
         WHERE ($1::smallint IS NULL OR p.wilaya_code = $1)
         ORDER BY p.created_at DESC LIMIT 200",
    )
    .bind(filter.wilaya)
    .fetch_all(&state.db)
    .await
    .map_err(|e| internal("list missing persons", e))?;

    let reports = rows
        .into_iter()
        .map(|r| MissingPerson {
            id: r.id,
            first_name: r.first_name,
            last_name: r.last_name,
            photo_url: r.photo_path.map(|p| format!("/api/uploads/{p}")),
            wilaya_code: r.wilaya_code,
            wilaya_name_ar: r.wilaya_name_ar,
            wilaya_name_fr: r.wilaya_name_fr,
            commune_name_ar: r.commune_name_ar,
            commune_name_fr: r.commune_name_fr,
            last_seen_details: r.last_seen_details,
            description: r.description,
            contact_phone: r.contact_phone,
            created_at: r.created_at,
        })
        .collect();
    Ok(Json(reports))
}

#[derive(Serialize)]
pub struct Created {
    id: i64,
}

/// Report a missing person. `multipart/form-data`: text fields plus an
/// optional `photo` part (jpeg/png/webp, ≤ 5 MB) stored under UPLOAD_DIR.
pub async fn create(
    State(state): State<AppState>,
    mut multipart: Multipart,
) -> Result<Json<Created>, HandlerError> {
    let mut first_name = String::new();
    let mut last_name = String::new();
    let mut wilaya_code: Option<i16> = None;
    let mut commune_id: Option<i32> = None;
    let mut last_seen_details = String::new();
    let mut description = String::new();
    let mut contact_phone = String::new();
    let mut photo: Option<(Vec<u8>, &'static str)> = None;

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|_| bad_request("invalid_form"))?
    {
        let name = field.name().unwrap_or_default().to_string();
        match name.as_str() {
            "photo" => {
                let ext = match field.content_type() {
                    Some("image/jpeg") => "jpg",
                    Some("image/png") => "png",
                    Some("image/webp") => "webp",
                    // An empty file input still submits a part; skip it.
                    _ => {
                        let data = field
                            .bytes()
                            .await
                            .map_err(|_| bad_request("invalid_photo"))?;
                        if data.is_empty() {
                            continue;
                        }
                        return Err(bad_request("invalid_photo"));
                    }
                };
                let data = field
                    .bytes()
                    .await
                    .map_err(|_| bad_request("invalid_photo"))?;
                if data.is_empty() {
                    continue;
                }
                if data.len() > MAX_PHOTO_BYTES {
                    return Err(bad_request("photo_too_large"));
                }
                photo = Some((data.to_vec(), ext));
            }
            _ => {
                let value = field
                    .text()
                    .await
                    .map_err(|_| bad_request("invalid_form"))?;
                match name.as_str() {
                    "first_name" => first_name = value,
                    "last_name" => last_name = value,
                    "wilaya_code" => wilaya_code = value.trim().parse().ok(),
                    "commune_id" => commune_id = value.trim().parse().ok(),
                    "last_seen_details" => last_seen_details = value,
                    "description" => description = value,
                    "contact_phone" => contact_phone = value,
                    _ => {}
                }
            }
        }
    }

    let first_name = require_text(&first_name, 100, "invalid_first_name")?;
    let last_name = require_text(&last_name, 100, "invalid_last_name")?;
    let contact_phone = require_phone(&contact_phone)?;
    let last_seen_details = optional_text(&last_seen_details, 500, "invalid_last_seen")?;
    let description = optional_text(&description, 2000, "invalid_description")?;
    let (Some(wilaya_code), Some(commune_id)) = (wilaya_code, commune_id) else {
        return Err(bad_request("invalid_location"));
    };
    validate_location(&state.db, wilaya_code, commune_id).await?;

    let photo_path = match photo {
        Some((data, ext)) => {
            let filename = format!("{}.{ext}", uuid::Uuid::new_v4().simple());
            let path = state.upload_dir.join(&filename);
            tokio::fs::write(&path, &data)
                .await
                .map_err(|e| internal("save photo", e))?;
            Some(filename)
        }
        None => None,
    };

    let inserted: Result<(i64,), sqlx::Error> = sqlx::query_as(
        "INSERT INTO missing_persons (first_name, last_name, photo_path, wilaya_code, commune_id,
                                      last_seen_details, description, contact_phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
    )
    .bind(&first_name)
    .bind(&last_name)
    .bind(&photo_path)
    .bind(wilaya_code)
    .bind(commune_id)
    .bind(&last_seen_details)
    .bind(&description)
    .bind(&contact_phone)
    .fetch_one(&state.db)
    .await;

    match inserted {
        Ok((id,)) => Ok(Json(Created { id })),
        Err(e) => {
            // Don't leave an orphaned file behind if the insert failed.
            if let Some(filename) = &photo_path {
                let _ = tokio::fs::remove_file(state.upload_dir.join(filename)).await;
            }
            Err(internal("create missing person", e))
        }
    }
}

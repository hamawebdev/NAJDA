use std::path::PathBuf;

use deadpool_redis::Pool as RedisPool;
use sqlx::PgPool;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub redis: RedisPool,
    /// Where missing-person photos are stored; served at `/api/uploads/*`.
    pub upload_dir: PathBuf,
}

use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub port: u16,
    pub database_url: String,
    pub redis_url: String,
}

impl Config {
    /// Reads configuration from the environment. `PORT` defaults to 8080;
    /// `DATABASE_URL` and `REDIS_URL` are required.
    pub fn from_env() -> Result<Self, String> {
        let port = match env::var("PORT") {
            Ok(value) => value
                .parse::<u16>()
                .map_err(|_| format!("PORT must be a number between 1 and 65535, got `{value}`"))?,
            Err(_) => 8080,
        };
        let database_url = env::var("DATABASE_URL").map_err(|_| {
            "DATABASE_URL is not set (e.g. postgres://najda:najda@localhost:5432/najda)".to_string()
        })?;
        let redis_url = env::var("REDIS_URL")
            .map_err(|_| "REDIS_URL is not set (e.g. redis://localhost:6379)".to_string())?;
        Ok(Self {
            port,
            database_url,
            redis_url,
        })
    }
}

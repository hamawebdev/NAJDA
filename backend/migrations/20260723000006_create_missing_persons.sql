-- Missing person reports. `photo_path` is the bare filename under UPLOAD_DIR
-- (served at /api/uploads/{file}); NULL when no photo was provided.
-- Last known location = wilaya + commune + free-text details.
CREATE TABLE missing_persons (
    id                BIGSERIAL PRIMARY KEY,
    first_name        TEXT NOT NULL,
    last_name         TEXT NOT NULL,
    photo_path        TEXT,
    wilaya_code       SMALLINT NOT NULL REFERENCES wilayas(code),
    commune_id        INTEGER NOT NULL REFERENCES communes(id),
    last_seen_details TEXT NOT NULL DEFAULT '',
    description       TEXT NOT NULL DEFAULT '',
    contact_phone     TEXT NOT NULL,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX missing_persons_wilaya_idx ON missing_persons(wilaya_code, created_at DESC);

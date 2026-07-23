-- Help requests from affected families. `needs` is one free-text field (the
-- UI offers quick-fill chips: water, food, medicine, evacuation, shelter,
-- clothing, baby supplies, other). Phone is public by design.
CREATE TABLE help_requests (
    id           BIGSERIAL PRIMARY KEY,
    full_name    TEXT NOT NULL,
    phone        TEXT NOT NULL,
    wilaya_code  SMALLINT NOT NULL REFERENCES wilayas(code),
    commune_id   INTEGER NOT NULL REFERENCES communes(id),
    neighborhood TEXT NOT NULL DEFAULT '',
    needs        TEXT NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX help_requests_wilaya_idx ON help_requests(wilaya_code, created_at DESC);

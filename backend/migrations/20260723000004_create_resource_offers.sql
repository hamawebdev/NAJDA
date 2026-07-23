-- Public resource offers. `categories` holds canonical slugs (water, food,
-- medicine, blankets, clothing, fuel, generators, transportation,
-- firefighting_equipment, first_aid, other) validated in Rust — no CHECK, so
-- adding a category never needs a migration. Phone is public by design.
CREATE TABLE resource_offers (
    id           BIGSERIAL PRIMARY KEY,
    full_name    TEXT NOT NULL,
    phone        TEXT NOT NULL,
    wilaya_code  SMALLINT NOT NULL REFERENCES wilayas(code),
    commune_id   INTEGER NOT NULL REFERENCES communes(id),
    neighborhood TEXT NOT NULL DEFAULT '',
    categories   TEXT[] NOT NULL,
    details      TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX resource_offers_wilaya_idx ON resource_offers(wilaya_code, created_at DESC);

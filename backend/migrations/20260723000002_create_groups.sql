-- Volunteer groups. The leader is folded into the group row: one leader = one
-- group, and `leader_phone` is the login key (UNIQUE makes phone+password
-- login unambiguous). Documented limitation: one phone number leads one group.
CREATE TABLE groups (
    id                BIGSERIAL PRIMARY KEY,
    name              TEXT NOT NULL,
    leader_first_name TEXT NOT NULL,
    leader_last_name  TEXT NOT NULL,
    leader_phone      TEXT NOT NULL UNIQUE,
    password_hash     TEXT NOT NULL,
    wilaya_code       SMALLINT NOT NULL REFERENCES wilayas(code),
    commune_id        INTEGER NOT NULL REFERENCES communes(id),
    neighborhood      TEXT NOT NULL DEFAULT '',
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX groups_wilaya_idx ON groups(wilaya_code);
CREATE INDEX groups_commune_idx ON groups(commune_id);

-- Firefighting volunteers register without an account. `token` is the opaque
-- secret returned once at registration; the browser stores it and presents it
-- as `X-Volunteer-Token` to join groups and view member contact details.
CREATE TABLE volunteers (
    id           BIGSERIAL PRIMARY KEY,
    token        TEXT NOT NULL UNIQUE,
    first_name   TEXT NOT NULL,
    last_name    TEXT NOT NULL,
    phone        TEXT NOT NULL,
    wilaya_code  SMALLINT NOT NULL REFERENCES wilayas(code),
    commune_id   INTEGER NOT NULL REFERENCES communes(id),
    neighborhood TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE group_members (
    group_id     BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    volunteer_id BIGINT NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    joined_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, volunteer_id)
);

CREATE INDEX group_members_volunteer_idx ON group_members(volunteer_id);

-- The only notification type is "volunteer joined", so the row itself is the
-- join event; volunteer details come from a JOIN at read time.
CREATE TABLE group_notifications (
    id           BIGSERIAL PRIMARY KEY,
    group_id     BIGINT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    volunteer_id BIGINT NOT NULL REFERENCES volunteers(id) ON DELETE CASCADE,
    read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX group_notifications_group_idx ON group_notifications(group_id, created_at DESC);

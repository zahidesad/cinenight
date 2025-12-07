ALTER TABLE users
    ADD COLUMN pending_email VARCHAR(255) NULL;

ALTER TABLE users
    ADD CONSTRAINT uk_users_pending_email UNIQUE (pending_email);
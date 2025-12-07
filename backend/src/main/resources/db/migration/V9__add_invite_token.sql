ALTER TABLE user_groups
    ADD COLUMN invite_token VARCHAR(64) NULL;

ALTER TABLE user_groups
    ADD CONSTRAINT uk_groups_invite_token UNIQUE (invite_token);

UPDATE user_groups SET invite_token = UUID() WHERE invite_token IS NULL;
ALTER TABLE user_groups MODIFY COLUMN invite_token VARCHAR(64) NOT NULL;
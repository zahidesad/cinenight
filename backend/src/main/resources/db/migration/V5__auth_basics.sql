SET @exists := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'email'
);
SET @ddl := IF(@exists > 0, 'SELECT 1',
               'ALTER TABLE users ADD COLUMN email VARCHAR(255) NOT NULL'
            );
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @exists := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'password_hash'
);
SET @ddl := IF(@exists > 0, 'SELECT 1',
               'ALTER TABLE users ADD COLUMN password_hash VARCHAR(60) NOT NULL'
            );
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @exists := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'display_name'
);
SET @ddl := IF(@exists > 0, 'SELECT 1',
               'ALTER TABLE users ADD COLUMN display_name VARCHAR(100) NULL'
            );
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @exists := (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'users'
      AND COLUMN_NAME = 'role'
);
SET @ddl := IF(@exists > 0, 'SELECT 1',
               'ALTER TABLE users ADD COLUMN `role` VARCHAR(20) NOT NULL DEFAULT ''USER'''
            );
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @ix_exists := (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'users'
      AND INDEX_NAME   = 'uk_users_email'
);
SET @ddl := IF(@ix_exists > 0, 'SELECT 1',
               'CREATE UNIQUE INDEX uk_users_email ON users(email)'
            );
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
                                                     id         BIGINT PRIMARY KEY AUTO_INCREMENT,
                                                     user_id    BIGINT       NOT NULL,
                                                     token      VARCHAR(64)  NOT NULL,
                                                     expires_at DATETIME     NOT NULL,
                                                     used_at    DATETIME     NULL,
                                                     created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                                     CONSTRAINT uk_prt_token UNIQUE (token),
                                                     CONSTRAINT fk_prt_user  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

SET @ix2_exists := (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME   = 'password_reset_tokens'
      AND INDEX_NAME   = 'idx_prt_user_id'
);
SET @ddl := IF(@ix2_exists > 0, 'SELECT 1',
               'CREATE INDEX idx_prt_user_id ON password_reset_tokens(user_id)'
            );
PREPARE s FROM @ddl; EXECUTE s; DEALLOCATE PREPARE s;

SET @db := 'cinenight';
SELECT
    GROUP_CONCAT(
            CONCAT(
                    'ALTER TABLE `', TABLE_SCHEMA, '`.`', TABLE_NAME, '` ',
                    'MODIFY COLUMN `', COLUMN_NAME, '` VARCHAR(', CHARACTER_MAXIMUM_LENGTH, ') ',
                    CASE WHEN IS_NULLABLE = 'NO' THEN 'NOT NULL' ELSE 'NULL' END
            )
            SEPARATOR '; '
    ) INTO @sql
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @db
  AND DATA_TYPE = 'char'
  AND TABLE_NAME NOT IN ('flyway_schema_history','spring_session','spring_session_attributes');


SET @sql = IFNULL(@sql, 'SELECT 1');

PREPARE s FROM @sql;
EXECUTE s;
DEALLOCATE PREPARE s;

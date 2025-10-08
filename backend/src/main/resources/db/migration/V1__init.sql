-- CineNight - V1 initial schema
-- MySQL 8.x
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- USERS
CREATE TABLE IF NOT EXISTS users (
                       id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                       email         VARCHAR(255) NOT NULL,
                       password_hash VARCHAR(255) NULL,
                       display_name  VARCHAR(100) NOT NULL,
                       avatar_url    VARCHAR(512) NULL,
                       status        ENUM('ACTIVE','DISABLED') NOT NULL DEFAULT 'ACTIVE',
                       created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- GROUPS
CREATE TABLE IF NOT EXISTS user_groups (
                             id          BIGINT AUTO_INCREMENT PRIMARY KEY,
                             name        VARCHAR(120) NOT NULL,
                             description TEXT NULL,
                             visibility  ENUM('PRIVATE','LINK') NOT NULL DEFAULT 'PRIVATE',
                             created_by  BIGINT NULL,
                             created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             CONSTRAINT fk_groups_created_by FOREIGN KEY (created_by)
                                 REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- GROUP MEMBERS (users <-> user_groups)
CREATE TABLE IF NOT EXISTS group_members (
                               group_id  BIGINT NOT NULL,
                               user_id   BIGINT NOT NULL,
                               role      ENUM('OWNER','ADMIN','MEMBER') NOT NULL DEFAULT 'MEMBER',
                               joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               PRIMARY KEY (group_id, user_id),
                               KEY idx_group_members_user (user_id),
                               CONSTRAINT fk_group_members_group FOREIGN KEY (group_id)
                                   REFERENCES user_groups(id) ON DELETE CASCADE,
                               CONSTRAINT fk_group_members_user FOREIGN KEY (user_id)
                                   REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MOVIES (TMDB cache)
CREATE TABLE IF NOT EXISTS movies (
                        id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                        tmdb_id         INT NOT NULL,
                        imdb_id         VARCHAR(20) NULL,
                        title           VARCHAR(255) NOT NULL,
                        original_title  VARCHAR(255) NULL,
                        release_year    SMALLINT NULL,
                        runtime_minutes SMALLINT NULL,
                        poster_path     VARCHAR(255) NULL,
                        backdrop_path   VARCHAR(255) NULL,
                        language        CHAR(2) NULL,
                        genres          VARCHAR(255) NULL,
                        fetched_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE KEY uk_movies_tmdb (tmdb_id),
                        UNIQUE KEY uk_movies_imdb (imdb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- EVENTS (watch nights)
CREATE TABLE IF NOT EXISTS watch_events (
                              id            BIGINT AUTO_INCREMENT PRIMARY KEY,
                              group_id      BIGINT NOT NULL,
                              title         VARCHAR(255) NOT NULL,
                              movie_id      BIGINT NULL,
                              description   TEXT NULL,
                              start_time    DATETIME NOT NULL,
                              end_time      DATETIME NULL,
                              timezone      VARCHAR(64) NOT NULL DEFAULT 'UTC',
                              location_text VARCHAR(255) NULL,
                              location_url  VARCHAR(255) NULL,
                              status        ENUM('DRAFT','SCHEDULED','CANCELLED','COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
                              ical_uid      VARCHAR(64) NULL,
                              created_by    BIGINT NULL,
                              created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              UNIQUE KEY uk_events_ical (ical_uid),
                              KEY idx_events_group (group_id),
                              KEY idx_events_movie (movie_id),
                              CONSTRAINT fk_events_group FOREIGN KEY (group_id)
                                  REFERENCES user_groups(id) ON DELETE CASCADE,
                              CONSTRAINT fk_events_movie FOREIGN KEY (movie_id)
                                  REFERENCES movies(id) ON DELETE SET NULL,
                              CONSTRAINT fk_events_created_by FOREIGN KEY (created_by)
                                  REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- POLLS (can belong to a group; may optionally link to an event)
CREATE TABLE IF NOT EXISTS polls (
                       id               BIGINT AUTO_INCREMENT PRIMARY KEY,
                       group_id         BIGINT NOT NULL,
                       event_id         BIGINT NULL,
                       title            VARCHAR(255) NOT NULL,
                       description      TEXT NULL,
                       voting_strategy  ENUM('SINGLE','MULTI','RANKED') NOT NULL DEFAULT 'SINGLE',
                       allow_add_options BOOLEAN NOT NULL DEFAULT TRUE,
                       max_votes_per_user INT NOT NULL DEFAULT 1,
                       is_open          BOOLEAN NOT NULL DEFAULT TRUE,
                       public_token     CHAR(32) NULL,
                       opens_at         DATETIME NULL,
                       closes_at        DATETIME NULL,
                       created_by       BIGINT NULL,
                       created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_polls_public_token (public_token),
                       KEY idx_polls_group (group_id),
                       KEY idx_polls_event (event_id),
                       CONSTRAINT fk_polls_group FOREIGN KEY (group_id)
                           REFERENCES user_groups(id) ON DELETE CASCADE,
                       CONSTRAINT fk_polls_event FOREIGN KEY (event_id)
                           REFERENCES watch_events(id) ON DELETE SET NULL,
                       CONSTRAINT fk_polls_created_by FOREIGN KEY (created_by)
                           REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- POLL OPTIONS (movie choices)
CREATE TABLE IF NOT EXISTS poll_options (
                              id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                              poll_id    BIGINT NOT NULL,
                              movie_id   BIGINT NOT NULL,
                              label      VARCHAR(255) NULL,
                              added_by   BIGINT NULL,
                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              UNIQUE KEY uk_poll_option_unique (poll_id, movie_id),
                              KEY idx_poll_options_poll (poll_id),
                              KEY idx_poll_options_movie (movie_id),
                              CONSTRAINT fk_poll_options_poll FOREIGN KEY (poll_id)
                                  REFERENCES polls(id) ON DELETE CASCADE,
                              CONSTRAINT fk_poll_options_movie FOREIGN KEY (movie_id)
                                  REFERENCES movies(id) ON DELETE RESTRICT,
                              CONSTRAINT fk_poll_options_added_by FOREIGN KEY (added_by)
                                  REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- VOTES (single vote per user per poll)
CREATE TABLE IF NOT EXISTS votes (
                       id         BIGINT AUTO_INCREMENT PRIMARY KEY,
                       poll_id    BIGINT NOT NULL,
                       option_id  BIGINT NOT NULL,
                       user_id    BIGINT NOT NULL,
                       weight     INT NOT NULL DEFAULT 1,
                       voted_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_votes_unique (poll_id, user_id),
                       KEY idx_votes_option (option_id),
                       KEY idx_votes_user (user_id),
                       CONSTRAINT fk_votes_poll FOREIGN KEY (poll_id)
                           REFERENCES polls(id) ON DELETE CASCADE,
                       CONSTRAINT fk_votes_option FOREIGN KEY (option_id)
                           REFERENCES poll_options(id) ON DELETE CASCADE,
                       CONSTRAINT fk_votes_user FOREIGN KEY (user_id)
                           REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- RSVPs
CREATE TABLE IF NOT EXISTS rsvps (
                       id           BIGINT AUTO_INCREMENT PRIMARY KEY,
                       event_id     BIGINT NOT NULL,
                       user_id      BIGINT NOT NULL,
                       status       ENUM('YES','NO','MAYBE') NOT NULL,
                       guests       INT NOT NULL DEFAULT 0,
                       comment      VARCHAR(255) NULL,
                       responded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       UNIQUE KEY uk_rsvps_unique (event_id, user_id),
                       KEY idx_rsvps_user (user_id),
                       CONSTRAINT fk_rsvps_event FOREIGN KEY (event_id)
                           REFERENCES watch_events(id) ON DELETE CASCADE,
                       CONSTRAINT fk_rsvps_user FOREIGN KEY (user_id)
                           REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS event_invites (
                               id              BIGINT AUTO_INCREMENT PRIMARY KEY,
                               event_id        BIGINT NOT NULL,
                               email           VARCHAR(255) NOT NULL,
                               invited_by      BIGINT NULL,
                               token           CHAR(36) NOT NULL,
                               status          ENUM('PENDING','ACCEPTED','DECLINED') NOT NULL DEFAULT 'PENDING',
                               invited_user_id BIGINT NULL,
                               created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               responded_at    TIMESTAMP NULL,
                               UNIQUE KEY uk_event_invites_token (token),
                               KEY idx_event_invites_event (event_id),
                               CONSTRAINT fk_event_invites_event FOREIGN KEY (event_id)
                                   REFERENCES watch_events(id) ON DELETE CASCADE,
                               CONSTRAINT fk_event_invites_invited_by FOREIGN KEY (invited_by)
                                   REFERENCES users(id) ON DELETE SET NULL,
                               CONSTRAINT fk_event_invites_user FOREIGN KEY (invited_user_id)
                                   REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

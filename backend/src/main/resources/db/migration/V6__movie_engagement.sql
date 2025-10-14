CREATE TABLE IF NOT EXISTS movie_view (
                                          id        BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          movie_id  BIGINT NOT NULL,
                                          viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                          ip        VARCHAR(45) NULL,
                                          user_agent VARCHAR(255) NULL,
                                          CONSTRAINT fk_movie_view_movie
                                              FOREIGN KEY (movie_id) REFERENCES movies (id)
                                                  ON DELETE CASCADE
);
CREATE INDEX idx_movie_view_movie ON movie_view(movie_id);
CREATE INDEX idx_movie_view_viewed_at ON movie_view(viewed_at);

CREATE TABLE IF NOT EXISTS movie_vote (
                                          id         BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          movie_id   BIGINT NOT NULL,
                                          rating     TINYINT NOT NULL,
                                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                          CONSTRAINT chk_movie_vote_rating CHECK (rating BETWEEN 1 AND 10),
                                          CONSTRAINT fk_movie_vote_movie
                                              FOREIGN KEY (movie_id) REFERENCES movies (id)
                                                  ON DELETE CASCADE
);
CREATE INDEX idx_movie_vote_movie ON movie_vote(movie_id);
CREATE INDEX idx_movie_vote_created_at ON movie_vote(created_at);
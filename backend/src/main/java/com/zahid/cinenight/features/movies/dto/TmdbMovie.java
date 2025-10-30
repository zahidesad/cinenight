package com.zahid.cinenight.features.movies.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TmdbMovie(
        Integer id,
        String title,
        String name,
        String original_title,
        String original_language,
        String release_date,
        Integer runtime,
        String poster_path,
        String backdrop_path,
        List<TmdbGenre> genres,
        List<Integer> genre_ids,
        String overview
) {}

package com.zahid.cinenight.features.movies.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TmdbMoviePage(
        int page,
        List<TmdbMovie> results,
        int total_pages,
        int total_results
) {}

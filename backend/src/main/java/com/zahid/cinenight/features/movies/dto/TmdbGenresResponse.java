package com.zahid.cinenight.features.movies.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TmdbGenresResponse(List<TmdbGenre> genres) {}

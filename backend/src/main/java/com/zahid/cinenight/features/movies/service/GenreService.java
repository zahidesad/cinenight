package com.zahid.cinenight.features.movies.service;

import com.zahid.cinenight.features.movies.dto.TmdbGenresResponse;
import com.zahid.cinenight.features.movies.dto.TmdbGenre;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.stream.Collectors;

@Service
public class GenreService {
    private final TmdbClient tmdb;
    public GenreService(TmdbClient tmdb) { this.tmdb = tmdb; }

    @Cacheable(value = "tmdbGenreMap", key = "#lang")
    public Map<Integer,String> genreMap(String lang) {
        TmdbGenresResponse res = tmdb.genres(lang);
        return res.genres().stream().collect(Collectors.toMap(TmdbGenre::id, TmdbGenre::name));
    }
}

package com.zahid.cinenight.features.home.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.home.service.HomeService;
import com.zahid.cinenight.features.movies.dto.TmdbMoviePage;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {
    private final HomeService service;

    public HomeController(HomeService service) { this.service = service; }

    @GetMapping("/trending")
    public ApiResponse<TmdbMoviePage> trending(
            @RequestParam(defaultValue = "tr-TR") String lang,
            @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.ok(service.trending(lang, page));
    }

    @GetMapping("/top-rated")
    public ApiResponse<TmdbMoviePage> topRated(
            @RequestParam(defaultValue = "tr-TR") String lang,
            @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.ok(service.topRated(lang, page));
    }

    @GetMapping("/top-movies")
    public ApiResponse<List<HomeService.TopMovie>> topMovies(
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.ok(service.topMovies(limit));
    }
}

package com.zahid.cinenight.features.movies.web;

import com.zahid.cinenight.common.api.ApiResponse;
import com.zahid.cinenight.features.movies.service.MovieService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController {

    private final MovieService service;
    public MovieController(MovieService service) { this.service = service; }

    @GetMapping("/{tmdbId}")
    public ApiResponse<MovieService.MovieDto> byId(@PathVariable int tmdbId,
                                                   @RequestParam(defaultValue = "tr-TR") String language) {
        return ApiResponse.ok(service.byId(tmdbId, language));
    }

    @GetMapping("/search")
    public ApiResponse<MovieService.PagedMovies> search(@RequestParam String q,
                                                        @RequestParam(defaultValue = "tr-TR") String language,
                                                        @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.ok(service.search(q, language, page));
    }

    @GetMapping("/trending")
    public ApiResponse<MovieService.PagedMovies> trending(@RequestParam(defaultValue = "tr-TR") String language,
                                                          @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.ok(service.trending(language, page));
    }
}

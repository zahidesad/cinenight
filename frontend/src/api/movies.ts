import { apiGet, apiPost } from "./client";

export type TmdbGenre = { id: number; name: string };

export type TmdbMovie = {
    id: number;
    title: string;
    original_title?: string;
    original_language?: string;
    release_date?: string | null;
    runtime?: number | null;
    poster_path?: string | null;
    backdrop_path?: string | null;
    genres?: TmdbGenre[];
    genre_ids?: number[];
};

export type TmdbMoviePage = {
    page: number;
    results: TmdbMovie[];
    total_pages: number;
    total_results: number;
};

export type MovieDto = {
    id: number;
    tmdbId: number;
    title: string;
    posterPath?: string | null;
    backdropPath?: string | null;
    language?: string | null;
    releaseYear?: number | null;
};

export type PagedMovies = {
    page: number;
    totalPages: number;
    results: MovieDto[];
};

export type HomeTopMovie = {
    id: number;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    language: string | null;
    releaseYear: number | null;
    voteCount: number;
    avgRating: number;
    viewCount: number;
    score: number;
};

export function tmdbTrending(lang = "tr-TR", page = 1) {
    return apiGet<TmdbMoviePage>(`/home/trending?lang=${encodeURIComponent(lang)}&page=${page}`);
}

export function tmdbTopRated(lang = "tr-TR", page = 1) {
    return apiGet<TmdbMoviePage>(`/home/top-rated?lang=${encodeURIComponent(lang)}&page=${page}`);
}

export function topMovies(limit = 10) {
    return apiGet<HomeTopMovie[]>(`/home/top-movies?limit=${limit}`);
}

export function byId(tmdbId: number, language = "tr-TR") {
    return apiGet<MovieDto>(`/movies/${tmdbId}?language=${encodeURIComponent(language)}`);
}

export function search(q: string, language = "tr-TR", page = 1) {
    return apiGet<PagedMovies>(
        `/movies/search?q=${encodeURIComponent(q)}&language=${encodeURIComponent(language)}&page=${page}`
    );
}

export function recordView(tmdbId: number, language = "tr-TR") {
    return apiPost<void>(`/movies/${tmdbId}/view?language=${encodeURIComponent(language)}`);
}

export function vote(tmdbId: number, rating: number, language = "tr-TR") {
    return apiPost<void>(`/movies/${tmdbId}/vote?rating=${rating}&language=${encodeURIComponent(language)}`);
}

export const MoviesApi = {
    tmdbTrending,
    tmdbTopRated,
    topMovies,
    byId,
    search,
    recordView,
    vote,
};

export const searchMovies = (q: string, language="tr-TR", page=1) =>
    apiGet<PagedMovies>(`/api/v1/movies/search?q=${encodeURIComponent(q)}&language=${language}&page=${page}`);


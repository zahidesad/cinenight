import { apiGet } from './client';
import type { TmdbMoviePage, TmdbMovie } from './movies';

export type { TmdbMovie }; // tüketen taraflar aynı modülden alsın

export function getTrending(lang = 'tr-TR', page = 1) {
    return apiGet<TmdbMoviePage>(`/home/trending?lang=${encodeURIComponent(lang)}&page=${page}`);
}

export function getTopRated(lang = 'tr-TR', page = 1) {
    return apiGet<TmdbMoviePage>(`/home/top-rated?lang=${encodeURIComponent(lang)}&page=${page}`);
}

export function getTopMovies(limit = 10) {
    return apiGet<
        {
            id: number;
            tmdbId: number;
            title: string;
            posterPath?: string | null;
            backdropPath?: string | null;
            language?: string | null;
            releaseYear?: number | null;
            voteCount: number;
            avgRating: number;
            viewCount: number;
            score: number;
        }[]
    >(`/home/top-movies?limit=${limit}`);
}

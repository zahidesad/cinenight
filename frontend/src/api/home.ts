// src/api/home.ts
import { apiGet, unwrap } from "./client";

export type TmdbMovie = {
    id: number;
    title?: string;
    name?: string; // bazı yanıtlar dizi adı için 'name' döndürebilir
    overview?: string;
    poster_path?: string;
    backdrop_path?: string;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    genre_ids?: number[];
};

export type TmdbPage<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
};

export type TopMovie = {
    id: number;
    title: string;
    posterPath?: string;
    score: number; // proje-özel metrik
};

function qs(params: Record<string, string | number | boolean | undefined>) {
    const s = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        s.append(k, String(v));
    });
    const str = s.toString();
    return str ? `?${str}` : "";
}

/** GET /home/trending */
export async function fetchTrending(lang = "tr-TR", page = 1) {
    const resp = await apiGet<TmdbPage<TmdbMovie>>(
        `/home/trending${qs({ lang, page })}`
    );
    return unwrap(resp); // Non-null döner
}

/** GET /home/top-rated */
export async function fetchTopRated(lang = "tr-TR", page = 1) {
    const resp = await apiGet<TmdbPage<TmdbMovie>>(
        `/home/top-rated${qs({ lang, page })}`
    );
    return unwrap(resp);
}

/** GET /home/top-movies */
export async function fetchTopMovies(limit = 12) {
    const resp = await apiGet<TopMovie[]>(`/home/top-movies${qs({ limit })}`);
    return unwrap(resp);
}

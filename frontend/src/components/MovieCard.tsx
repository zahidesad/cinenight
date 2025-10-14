import { useState } from "react";
import { MoviesApi } from "@/api/movies";
import type { TmdbMovie } from "@/api/movies";

const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

type TopMovie = {
    tmdbId: number;
    title: string;
    posterPath?: string | null;
    releaseYear?: number | null;
};

type Props =
    | { variant?: "tmdb"; movie: TmdbMovie } // default
    | { variant: "top";  movie: TopMovie };

export default function MovieCard(props: Props) {
    const [busy, setBusy] = useState(false);

    const tmdbId    = props.variant === "top" ? props.movie.tmdbId : props.movie.id;
    const title     = props.movie.title;
    const poster    = props.variant === "top" ? props.movie.posterPath : props.movie.poster_path;
    const posterUrl = poster ? `${IMG}/w342${poster}` : "/no-poster.svg";

    const onClick = async () => {
        try {
            setBusy(true);
            await MoviesApi.recordView(tmdbId);
        } finally {
            setBusy(false);
        }
    };

    return (
        <button
            type="button"
            className="group cursor-pointer text-left"
            onClick={onClick}
            title={title}
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl shadow">
                <img
                    src={posterUrl}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {busy && <div className="absolute inset-0 bg-black/30" />}
            </div>
            <div className="mt-2 text-sm font-medium line-clamp-2">{title}</div>
        </button>
    );
}

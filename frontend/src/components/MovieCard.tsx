import { useState } from "react";
import { MoviesApi } from "@/api/movies";
import type { TmdbMovie } from "@/api/movies";

const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

type AnyMovie = TmdbMovie & {
    tmdbId?: number;
    posterPath?: string | null;
    name?: string;
};

type TopMovie = {
    tmdbId: number;
    title: string;
    posterPath?: string | null;
    releaseYear?: number | null;
};

type BaseProps = {
    onCardClick?: (tmdbId: number) => void;
};

type Props =
    (
        | { variant?: "tmdb"; movie: AnyMovie } // default
        | { variant: "top"; movie: TopMovie }
        ) & BaseProps;


export default function MovieCard(props: Props) {
    const { onCardClick } = props;
    const [busy, setBusy] = useState(false);

    const tmdbId = (props.movie as AnyMovie).tmdbId || (props.movie as AnyMovie).id;

    const title = (props.movie as AnyMovie).title || (props.movie as AnyMovie).name || "Başlık Yok";

    const poster = (props.movie as AnyMovie).posterPath || (props.movie as AnyMovie).poster_path;

    const posterUrl = poster ? `${IMG}/w342${poster}` : "/no-poster.svg";

    const onClick = async () => {
        // EKLENDİ: Eğer onCardClick prop'u varsa, modalı açmak için çağır.
        if (onCardClick) {
            onCardClick(tmdbId);
        }

        // Mevcut izlenme kaydı mantığını koru
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
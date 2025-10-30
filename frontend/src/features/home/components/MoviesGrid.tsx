import MovieCard from "@/components/MovieCard";
import ErrorBlock from "./ErrorBlock";
import { SkeletonGrid } from "./Skeletons";
import type { TmdbMovie, HomeTopMovie, MovieDto } from "@/api/movies";

type AnyMovieType = TmdbMovie | HomeTopMovie | MovieDto;

export default function MoviesGrid({
                                       items,
                                       variant,
                                       loading,
                                       error,
                                       onRetry,
                                       emptyText = "Gösterilecek öğe bulunamadı.",
                                       onMovieClick,
                                   }: {
    items: AnyMovieType[];
    variant: "tmdb" | "top";
    loading: boolean;
    error: boolean;
    onRetry: () => void;
    emptyText?: string;
    onMovieClick?: (tmdbId: number) => void;
}) {
    if (error) return <ErrorBlock onRetry={onRetry} />;

    if (loading && items.length === 0) return <SkeletonGrid />;

    if (!loading && items.length === 0)
        return <div className="card p-6 text-gray-300">{emptyText}</div>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {items.map((m: AnyMovieType) => {
                const key = (m as MovieDto).tmdbId ?? (m as TmdbMovie).id;
                return (
                    <MovieCard
                        key={`${variant}-${key}`}
                        movie={m as never}
                        variant={variant}
                        onCardClick={onMovieClick}
                    />
                );
            })}
            {loading && <SkeletonGrid compact />}
        </div>
    );
}
import MovieCard from "@/components/MovieCard";
import ErrorBlock from "./ErrorBlock";
import { SkeletonGrid } from "./Skeletons";

export default function MoviesGrid({
                                       items,
                                       variant,
                                       loading,
                                       error,
                                       onRetry,
                                       emptyText = "Gösterilecek öğe bulunamadı.",
                                   }: {
    items: any[];
    variant: "tmdb" | "top";
    loading: boolean;
    error: boolean;
    onRetry: () => void;
    emptyText?: string;
}) {
    if (error) return <ErrorBlock onRetry={onRetry} />;

    if (loading && items.length === 0) return <SkeletonGrid />;

    if (!loading && items.length === 0)
        return <div className="card p-6 text-gray-300">{emptyText}</div>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {items.map((m) => (
                <MovieCard key={`${variant}-${m.id ?? m.tmdbId}`} movie={m} variant={variant} />
            ))}
            {loading && <SkeletonGrid compact />}
        </div>
    );
}

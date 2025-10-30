import { Search } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { SkeletonBanner, SkeletonRow, EmptyRow } from "./Skeletons";
import {MovieDto, PagedMovies, TmdbMovie} from "@/api/movies";

type FeaturedMovie = TmdbMovie & { name?: string };

type Props = {
    featured?: FeaturedMovie | null;
    q?: string;
    onQueryChange?: (v: string) => void;
    isSearching: boolean;
    searchErr: string | null;
    searchResults: PagedMovies | null;
    onRetrySearch?: () => void;
    onMovieClick?: (tmdbId: number) => void;
};

export default function HomeHero({
                                     featured,
                                     q,
                                     onQueryChange,
                                     isSearching,
                                     searchErr,
                                     searchResults,
                                     onRetrySearch,
                                     onMovieClick,
                                 }: Props) {
    const query = (q ?? "").trim();
    const results: MovieDto[] = searchResults?.results ?? [];
    const showDropdown = query.length > 0 && (isSearching || !!searchErr || !!searchResults);

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="card p-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Bu akşam ne izliyoruz?</h1>
                    <p className="mt-2 text-gray-300">
                        Arkadaşlarınla film öner, oy ver ve kazanan filme göre izleme gecesini planla. RSVP ve iCal ile herkes senkron.
                    </p>
                </div>

                <div className="mt-6">
                    <label className="text-sm text-gray-400">Hızlı arama</label>
                    <div className="mt-1 relative">
                        <input
                            value={q ?? ""}
                            onChange={(e) => onQueryChange?.(e.target.value)}
                            placeholder="Film ara… (ör. Inception)"
                            className="w-full rounded-xl bg-gray-800/70 border border-white/10 px-4 py-3 pr-10 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>

                    {showDropdown && (
                        <div className="mt-3 card p-3 max-h-80 overflow-auto">
                            {isSearching && <SkeletonRow text="Aranıyor…" />}

                            {searchErr && (
                                <div className="flex items-center justify-between text-red-300">
                                    <span>{searchErr}</span>
                                    <button onClick={() => onRetrySearch?.()} className="text-sm underline">
                                        yeniden dene
                                    </button>
                                </div>
                            )}

                            {!isSearching && !searchErr && results.length === 0 && <EmptyRow text="Sonuç bulunamadı." />}

                            {!isSearching && !searchErr && results.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {results.map((m: MovieDto) => ( // GÜNCELLENDİ: m: MovieDto
                                        <MovieCard
                                            key={`s-${m.tmdbId}`}
                                            movie={m as never}
                                            variant="tmdb"
                                            onCardClick={onMovieClick}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="card p-0 overflow-hidden flex">
                {featured ? (
                    <div className="flex-1 flex items-end bg-gradient-to-t from-black/80 to-transparent relative">
                        {featured?.backdrop_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w780${featured.backdrop_path}`}
                                className="absolute inset-0 h-full w-full object-cover"
                                loading="lazy"
                                alt=""
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gray-800" />
                        )}
                        <div className="relative p-5">
                            <h3 className="text-xl font-semibold text-white">
                                {featured?.title ?? featured?.name ?? "Seçili film"}
                            </h3>
                            {/* ... */}
                        </div>
                    </div>
                ) : (
                    <div className="p-6 w-full">
                        <SkeletonBanner />
                    </div>
                )}
            </div>
        </section>
    );
}
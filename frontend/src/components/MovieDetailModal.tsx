import { useEffect, useState } from "react";
import { X, Loader, AlertCircle } from "lucide-react";
import { MoviesApi, type MovieDto } from "@/api/movies";

const IMG_BASE = import.meta.env.VITE_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

type Props = {
    tmdbId: number;
    onClose: () => void;
};

export default function MovieDetailModal({ tmdbId, onClose }: Props) {
    const [movie, setMovie] = useState<MovieDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDetails() {
            setLoading(true);
            setError(null);
            const res = await MoviesApi.byId(tmdbId);
            if (res.ok) {
                setMovie(res.data);
            } else {
                setError(res.error || "Film detayları yüklenemedi.");
            }
            setLoading(false);
        }
        fetchDetails();
    }, [tmdbId]);

    const posterUrl = movie?.posterPath ? `${IMG_BASE}/w500${movie.posterPath}` : "/no-poster.svg";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Kapat Butonu */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-800/70 text-gray-300 hover:text-white"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Yükleniyor durumu */}
                {loading && (
                    <div className="flex h-96 items-center justify-center gap-2 text-gray-300">
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Detaylar yükleniyor...</span>
                    </div>
                )}

                {/* Hata durumu */}
                {error && (
                    <div className="flex h-96 flex-col items-center justify-center gap-2 text-red-300">
                        <AlertCircle className="h-6 w-6" />
                        <span>{error}</span>
                        <button onClick={onClose} className="mt-4 text-sm text-gray-200 underline">Kapat</button>
                    </div>
                )}

                {/* Başarılı durum */}
                {movie && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <img
                                src={posterUrl}
                                alt={movie.title}
                                className="w-full h-auto rounded-l-xl object-cover"
                            />
                        </div>
                        <div className="md:col-span-2 p-6 pt-10 md:pt-6 space-y-3">
                            <h2 className="text-2xl font-bold text-white">{movie.title}</h2>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                                {movie.releaseYear && (
                                    <span>🗓️ {movie.releaseYear}</span>
                                )}
                                {movie.language && (
                                    <span>🌍 {movie.language.toUpperCase()}</span>
                                )}
                            </div>

                            <p className="text-gray-300">
                                {movie.description || "Açıklama bulunamadı."}
                            </p>

                            {/* TODO: Oylama ve diğer butonlar buraya eklenebilir */}
                            <div className="pt-4">
                                <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                                    Oylamaya Ekle
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
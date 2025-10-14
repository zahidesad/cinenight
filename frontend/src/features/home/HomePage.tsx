import { useEffect, useState } from 'react';
import MovieCard from '@/components/MovieCard';
import { getTrending } from '@/api/home';
import type { TmdbMovie } from '@/api/movies';

export default function HomePage() {
    const [trending, setTrending] = useState<TmdbMovie[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getTrending('tr-TR', 1).then((r) => {
            if (r.ok && r.data) setTrending(r.data.results ?? []);
            else setError(r.error ?? 'Bir şeyler ters gitti');
        });
    }, []);

    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {trending.map((m) => (
                <MovieCard key={m.id} movie={m} />
            ))}
        </div>
    );
}

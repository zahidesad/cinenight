import { useCallback, useEffect, useMemo, useState } from "react";
import {
    fetchTrending,
    fetchTopRated,
    fetchTopMovies,
    TmdbMovie,
    TopMovie,
} from "@/api/home";

type LoadingState = { trending: boolean; topRated: boolean; topMovies: boolean };

export type HomeData = {
    lang: string;
    setLang: (l: string) => void;
    limit: number;
    setLimit: (n: number) => void;

    trending: TmdbMovie[];
    trendingPage: number;
    trendingTotalPages: number;
    hasMoreTrending: boolean;
    loadMoreTrending: () => Promise<void>;
    reloadTrending: () => Promise<void>;

    topRated: TmdbMovie[];
    topRatedPage: number;
    topRatedTotalPages: number;
    hasMoreTopRated: boolean;
    loadMoreTopRated: () => Promise<void>;
    reloadTopRated: () => Promise<void>;

    topMovies: TopMovie[];
    reloadTopMovies: () => Promise<void>;

    refreshAll: () => Promise<void>;
    loading: LoadingState;
    error: string | null;
};

export function useHomeData(
    initialLang = "tr-TR",
    initialLimit = 12
): HomeData {
    const [lang, setLang] = useState(initialLang);
    const [limit, setLimit] = useState(initialLimit);

    const [trending, setTrending] = useState<TmdbMovie[]>([]);
    const [trendingPage, setTrendingPage] = useState(0);
    const [trendingTotalPages, setTrendingTotalPages] = useState(1);

    const [topRated, setTopRated] = useState<TmdbMovie[]>([]);
    const [topRatedPage, setTopRatedPage] = useState(0);
    const [topRatedTotalPages, setTopRatedTotalPages] = useState(1);

    const [topMovies, setTopMovies] = useState<TopMovie[]>([]);

    const [loading, setLoading] = useState<LoadingState>({
        trending: false,
        topRated: false,
        topMovies: false,
    });
    const [error, setError] = useState<string | null>(null);

    const fetchTrendingPage = useCallback(
        async (opts: { append?: boolean; page?: number } = {}) => {
            setLoading((s) => ({ ...s, trending: true }));
            setError(null);
            try {
                const page = await fetchTrending(
                    lang,
                    opts.page ?? (opts.append ? trendingPage + 1 : 1)
                );
                setTrending((prev) =>
                    opts.append ? [...prev, ...page.results] : page.results
                );
                setTrendingPage(page.page);
                setTrendingTotalPages(page.total_pages);
            } catch (e: any) {
                setError(e?.message ?? "Trendler yüklenemedi.");
            } finally {
                setLoading((s) => ({ ...s, trending: false }));
            }
        },
        [lang, trendingPage]
    );

    const fetchTopRatedPage = useCallback(
        async (opts: { append?: boolean; page?: number } = {}) => {
            setLoading((s) => ({ ...s, topRated: true }));
            setError(null);
            try {
                const page = await fetchTopRated(
                    lang,
                    opts.page ?? (opts.append ? topRatedPage + 1 : 1)
                );
                setTopRated((prev) =>
                    opts.append ? [...prev, ...page.results] : page.results
                );
                setTopRatedPage(page.page);
                setTopRatedTotalPages(page.total_pages);
            } catch (e: any) {
                setError(e?.message ?? "En yüksek puanlılar yüklenemedi.");
            } finally {
                setLoading((s) => ({ ...s, topRated: false }));
            }
        },
        [lang, topRatedPage]
    );

    const fetchTop = useCallback(async () => {
        setLoading((s) => ({ ...s, topMovies: true }));
        setError(null);
        try {
            const list = await fetchTopMovies(limit);
            setTopMovies(list);
        } catch (e: any) {
            setError(e?.message ?? "Top CineNight listesi yüklenemedi.");
        } finally {
            setLoading((s) => ({ ...s, topMovies: false }));
        }
    }, [limit]);

    const refreshAll = useCallback(async () => {
        await Promise.all([
            fetchTrendingPage({ page: 1 }),
            fetchTopRatedPage({ page: 1 }),
            fetchTop(),
        ]);
    }, [fetchTop, fetchTopRatedPage, fetchTrendingPage]);

    const loadMoreTrending = useCallback(async () => {
        if (trendingPage >= trendingTotalPages || loading.trending) return;
        await fetchTrendingPage({ append: true, page: trendingPage + 1 });
    }, [fetchTrendingPage, trendingPage, trendingTotalPages, loading.trending]);

    const loadMoreTopRated = useCallback(async () => {
        if (topRatedPage >= topRatedTotalPages || loading.topRated) return;
        await fetchTopRatedPage({ append: true, page: topRatedPage + 1 });
    }, [fetchTopRatedPage, topRatedPage, topRatedTotalPages, loading.topRated]);

    const reloadTrending = useCallback(
        async () => fetchTrendingPage({ page: 1 }),
        [fetchTrendingPage]
    );
    const reloadTopRated = useCallback(
        async () => fetchTopRatedPage({ page: 1 }),
        [fetchTopRatedPage]
    );
    const reloadTopMovies = useCallback(async () => fetchTop(), [fetchTop]);

    const hasMoreTrending = useMemo(
        () => trendingPage < trendingTotalPages,
        [trendingPage, trendingTotalPages]
    );
    const hasMoreTopRated = useMemo(
        () => topRatedPage < topRatedTotalPages,
        [topRatedPage, topRatedTotalPages]
    );

    // İlk yükleme + dil/limit değişince tazele
    useEffect(() => {
        refreshAll();
    }, [lang, limit, refreshAll]);

    return {
        lang,
        setLang,
        limit,
        setLimit,

        trending,
        trendingPage,
        trendingTotalPages,
        hasMoreTrending,
        loadMoreTrending,
        reloadTrending,

        topRated,
        topRatedPage,
        topRatedTotalPages,
        hasMoreTopRated,
        loadMoreTopRated,
        reloadTopRated,

        topMovies,
        reloadTopMovies,

        refreshAll,
        loading,
        error,
    };
}

export default useHomeData;

import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

export type TabKey = "trending" | "toprated" | "cinenight";

export default function MoviesTabs({
                                       active,
                                       onChange,
                                       onLoadMore,
                                       canLoadMore = false,
                                       limitTop = 12,
                                       onChangeLimit,
                                       onRefreshTop,
                                   }: {
    active: TabKey;
    onChange?: (t: TabKey) => void;
    onLoadMore?: () => void;
    canLoadMore?: boolean;
    limitTop?: number;
    onChangeLimit?: (v: number) => void;
    onRefreshTop?: () => void;
}) {
    const { t } = useTranslation();

    const TABS: { key: TabKey; label: string }[] = [
        { key: "trending", label: t('home.tabs.trending') },
        { key: "toprated", label: t('home.tabs.top_rated') },
        { key: "cinenight", label: t('home.tabs.top_cinenight') },
    ];

    return (
        <div className="flex items-center justify-between">
            <div className="inline-flex rounded-xl bg-gray-900/60 p-1 border border-white/10">
                {TABS.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => onChange?.(t.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            active === t.key
                                ? "bg-indigo-600 text-white"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2">
                {active === "cinenight" ? (
                    <>
                        <select
                            value={limitTop}
                            onChange={(e) => onChangeLimit?.(Number(e.target.value))}
                            className="rounded-lg bg-gray-900/60 border border-white/10 px-3 py-2 text-sm text-gray-200"
                        >
                            {[8, 12, 16, 24].map((n) => (
                                <option key={n} value={n}>
                                    Top {n}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => onRefreshTop?.()}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-200 hover:bg-white/5"
                        >
                            <RefreshCw className="h-4 w-4" /> {t('common.refresh')}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onLoadMore?.()}
                        disabled={!canLoadMore}
                        className={`inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm ${
                            canLoadMore ? "text-gray-200 hover:bg-white/5" : "text-gray-500 cursor-not-allowed"
                        }`}
                        title={canLoadMore ? t('common.load_more') : t('common.no_more_pages')}
                    >
                        {t('common.load_more')}
                    </button>
                )}
            </div>
        </div>
    );
}
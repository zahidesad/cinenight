export function SkeletonGrid({ compact = false }: { compact?: boolean }) {
    const n = compact ? 6 : 12;
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: n }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="card h-64 animate-pulse overflow-hidden">
            <div className="h-40 bg-gray-800" />
            <div className="p-3 space-y-2">
                <div className="h-4 bg-gray-800 rounded" />
                <div className="h-4 w-1/2 bg-gray-800 rounded" />
            </div>
        </div>
    );
}

export function SkeletonBanner() {
    return (
        <div className="h-full w-full animate-pulse">
            <div className="h-full w-full bg-gray-800 rounded-xl" />
        </div>
    );
}

export function SkeletonRow({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3 text-gray-400">
            <div className="h-4 w-4 rounded-full bg-gray-700 animate-pulse" />
            <span>{text}</span>
        </div>
    );
}

export function EmptyRow({ text }: { text: string }) {
    return <div className="text-gray-400">{text}</div>;
}

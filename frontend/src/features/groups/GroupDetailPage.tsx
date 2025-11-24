import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchActivePoll, castVote, type PollDetailDto } from '@/api/polls';
import { ChevronLeft, Loader2, Users, Trophy, Share2, Check, FileText, Star } from 'lucide-react';
import MovieDetailModal from '@/components/MovieDetailModal';

const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

export default function GroupDetailPage() {
    const { groupId } = useParams();
    const [poll, setPoll] = useState<PollDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [votingId, setVotingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null); // Modal için state

    const loadPoll = async () => {
        try {
            const data = await fetchActivePoll(Number(groupId));
            setPoll(data);
            setError(null);
        } catch (err: unknown) {
            console.error(err);
            setError("Bu grupta henüz aktif bir anket yok veya bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPoll();
    }, [groupId]);

    const handleVote = async (optionId: number) => {
        if (!poll) return;
        setVotingId(optionId);

        // Backend "varsa güncelle, yoksa ekle" mantığında çalışıyor.
        const res = await castVote(poll.id, optionId);

        if (res.ok) {
            await loadPoll(); // Güncel oy sayılarını ve 'isVotedByMe' durumunu çek
        }
        setVotingId(null);
    };

    const handleCopyInvite = () => {
        const link = `${window.location.origin}/join/${groupId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !poll) {
        return (
            <div className="max-w-4xl mx-auto mt-10 text-center px-4">
                <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-10">
                    <h2 className="text-xl font-semibold text-white mb-2">Henüz Anket Yok</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link to="/" className="inline-block rounded-lg bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 font-medium transition">
                        Film Bul & Öner
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20 px-4">
            {/* --- Header --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{poll.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <span className={`w-2 h-2 rounded-full ${poll.isOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                            {poll.isOpen ? 'Oylama Aktif' : 'Kapandı'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCopyInvite}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20 transition text-sm font-medium border border-indigo-500/20"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Link Kopyalandı" : "Arkadaşlarını Davet Et"}
                </button>
            </div>

            {/* --- Etkinlik Detay Kartı --- */}
            <div className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row gap-6 shadow-inner">
                <div className="p-3 h-fit rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300">
                    <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ETKİNLİK DETAYLARI</h4>
                    <div className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed font-medium">
                        {poll.description || "Henüz detay girilmedi."}
                    </div>
                </div>
            </div>

            {/* --- Film Grid --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {poll.options.map((opt, index) => (
                    <div
                        key={opt.id}
                        className={`relative group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 bg-gray-900/60 ${
                            opt.isVotedByMe
                                ? 'border-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] ring-1 ring-indigo-500/50'
                                : 'border-white/10 hover:border-white/20 hover:-translate-y-1'
                        }`}
                    >
                        {/* Lider Rozeti */}
                        {index === 0 && opt.voteCount > 0 && (
                            <div className="absolute top-3 right-3 z-10">
                                <div className="bg-amber-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                    <Trophy className="h-3 w-3" /> LİDER
                                </div>
                            </div>
                        )}

                        {/* Poster Alanı (Tıklanabilir -> Modal Açar) */}
                        <div
                            className="aspect-[2/3] w-full relative overflow-hidden cursor-pointer"
                            onClick={() => setSelectedMovieId(opt.tmdbId)}
                        >
                            <img
                                src={opt.posterPath ? `${IMG}/w500${opt.posterPath}` : '/no-poster.svg'}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                alt={opt.title}
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                <span className="text-white text-sm font-medium border border-white/30 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-white hover:text-black transition-colors">
                                    Detaylar
                                </span>
                            </div>
                        </div>

                        {/* Kart Alt Bilgi */}
                        <div className="p-4 flex-1 flex flex-col">
                            <h3
                                className="font-bold text-white text-lg leading-tight line-clamp-1 mb-1"
                                title={opt.title}
                            >
                                {opt.title}
                            </h3>

                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                <span>{opt.releaseYear || 'N/A'}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-gray-500">
                                    <Users className="h-3 w-3" /> {opt.addedBy}
                                </span>
                            </div>

                            <div className="mt-auto pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <Star className={`h-4 w-4 ${opt.voteCount > 0 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
                                        <span className="font-bold text-white">{opt.voteCount}</span>
                                        <span className="text-gray-500">oy</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleVote(opt.id)}
                                    disabled={votingId !== null}
                                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                                        opt.isVotedByMe
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 cursor-default'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white active:scale-95'
                                    }`}
                                >
                                    {votingId === opt.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : opt.isVotedByMe ? (
                                        <><Check className="h-4 w-4" /> Senin Oyun</>
                                    ) : (
                                        'Buna Oy Ver'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Film Detay Modalı --- */}
            {selectedMovieId && (
                <MovieDetailModal
                    tmdbId={selectedMovieId}
                    onClose={() => setSelectedMovieId(null)}
                />
            )}
        </div>
    );
}
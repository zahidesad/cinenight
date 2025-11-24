import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchActivePoll, castVote, type PollDetailDto } from '@/api/polls';
import { ChevronLeft, Loader2, Users, Trophy, Share2, Check, FileText } from 'lucide-react';

const IMG = import.meta.env.VITE_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

export default function GroupDetailPage() {
    const { groupId } = useParams();
    const [poll, setPoll] = useState<PollDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [votingId, setVotingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const loadPoll = async () => {
        try {
            const data = await fetchActivePoll(Number(groupId));
            setPoll(data);
            setError(null);
        } catch (err: unknown) {
            console.error(err);
            setError("Bu grupta henüz aktif bir anket yok. Bir film önererek başlatabilirsin.");
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
        const res = await castVote(poll.id, optionId);
        if (res.ok) await loadPoll();
        setVotingId(null);
    };

    const handleCopyInvite = () => {
        const link = `${window.location.origin}/join/${groupId}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="flex h-[80vh] items-center justify-center text-gray-400"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    if (error || !poll) {
        return (
            <div className="max-w-4xl mx-auto mt-10 text-center">
                <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-10">
                    <h2 className="text-xl font-semibold text-white mb-2">Henüz Anket Yok</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <div className="flex justify-center gap-4">
                        <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300">Gruplara Dön</Link>
                        <Link to="/" className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Film Bul & Öner</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Üst Bilgi & Davet Alanı */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{poll.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <span className={`w-2 h-2 rounded-full ${poll.isOpen ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                            {poll.isOpen ? 'Oylama Aktif' : 'Kapandı'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCopyInvite}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-indigo-300 hover:bg-gray-700 transition text-sm font-medium border border-indigo-500/20"
                >
                    {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    {copied ? "Link Kopyalandı" : "Arkadaşlarını Davet Et"}
                </button>
            </div>

            {/* Dinamik Etkinlik Notları Alanı (Statik Veri Yerine) */}
            <div className="bg-gray-900/40 border border-white/5 p-5 rounded-xl flex gap-4">
                <div className="p-2 h-fit rounded-lg bg-indigo-500/10 text-indigo-400">
                    <FileText className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-1">Etkinlik Detayları</h4>
                    <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                        {poll.description || "Henüz tarih veya yer bilgisi girilmedi. Bu alana etkinlik zamanı ve detayları yazılabilir."}
                    </p>
                </div>
            </div>

            {/* Seçenekler Listesi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {poll.options.map((opt, index) => (
                    <div
                        key={opt.id}
                        className={`relative group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${
                            opt.isVotedByMe
                                ? 'border-indigo-500 bg-gray-900 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)] scale-[1.02]'
                                : 'border-white/10 bg-gray-900/40 hover:border-white/20 hover:bg-gray-900/80'
                        }`}
                    >
                        {/* Lider Rozeti */}
                        {index === 0 && opt.voteCount > 0 && (
                            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-3 z-10">
                                <div className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                                    <Trophy className="h-3 w-3" /> LİDER
                                </div>
                            </div>
                        )}

                        {/* Poster Alanı */}
                        <div className="aspect-[16/9] w-full relative overflow-hidden bg-gray-950">
                            <img
                                src={opt.posterPath ? `${IMG}/w500${opt.posterPath}` : '/no-poster.svg'}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                alt={opt.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                            <div className="absolute bottom-3 left-3 right-3">
                                <h3 className="font-bold text-white text-lg leading-tight drop-shadow-md line-clamp-2">{opt.title}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                                    <span>{opt.releaseYear || 'N/A'}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {opt.addedBy}</span>
                                </div>
                            </div>
                        </div>

                        {/* Alt Kısım: Oylama Butonu */}
                        <div className="p-4 mt-auto border-t border-white/5 bg-gray-900/50">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm text-gray-400">Toplam Oy</span>
                                <span className="text-lg font-bold text-white">{opt.voteCount}</span>
                            </div>

                            <button
                                onClick={() => handleVote(opt.id)}
                                disabled={votingId !== null}
                                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                                    opt.isVotedByMe
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
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
                ))}
            </div>
        </div>
    );
}
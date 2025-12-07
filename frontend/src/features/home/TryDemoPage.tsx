import { useState } from 'react';
import { Calendar, Check, Film, MapPin, Trophy, X, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- MOCK DATA ---
const MOCK_POLL_OPTIONS = [
    {
        id: 1,
        title: 'Inception',
        releaseYear: 2010,
        posterPath: '/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        backdropPath: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', // EKLENDİ
        voteCount: 4,
        addedBy: 'Ahmet',
        isVotedByMe: false
    },
    {
        id: 2,
        title: 'Interstellar',
        releaseYear: 2014,
        posterPath: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdropPath: '/pbrkL804c8yAv3zBZR4QPEafpAR.jpg', // EKLENDİ
        voteCount: 2,
        addedBy: 'Zeynep',
        isVotedByMe: false
    },
    {
        id: 3,
        title: 'The Prestige',
        releaseYear: 2006,
        posterPath: '/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg',
        backdropPath: '/6V1diE50sc44pL95OApQYJ979X.jpg', // EKLENDİ
        voteCount: 1,
        addedBy: 'Can',
        isVotedByMe: false
    },
];

const MOCK_EVENTS = [
    {
        id: 101,
        title: 'Christopher Nolan Gecesi',
        startTime: new Date().toISOString(), // Bugün
        locationText: 'Discord #film-gecesi',
        movieTitle: 'Inception',
        backdropPath: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg', // EKLENDİ
        myRsvp: null as 'YES' | 'NO' | 'MAYBE' | null,
        participants: [
            { userId: 1, displayName: 'Ahmet', avatarUrl: '' },
            { userId: 2, displayName: 'Zeynep', avatarUrl: '' },
            { userId: 3, displayName: 'Mehmet', avatarUrl: '' },
        ]
    }
];

const IMG_BASE = "https://image.tmdb.org/t/p";

export default function TryDemoPage() {
    // Local State ile interaktivite simülasyonu
    const [options, setOptions] = useState(MOCK_POLL_OPTIONS);
    const [events, setEvents] = useState(MOCK_EVENTS);

    // Oy Verme Simülasyonu
    const handleVote = (id: number) => {
        setOptions(prev => prev.map(opt => {
            // Önceki oyu kaldır
            if (opt.isVotedByMe) return { ...opt, isVotedByMe: false, voteCount: opt.voteCount - 1 };
            // Yeni oyu ekle
            if (opt.id === id) return { ...opt, isVotedByMe: true, voteCount: opt.voteCount + 1 };
            return opt;
        }));
    };

    // RSVP Simülasyonu
    const handleRsvp = (eventId: number, status: 'YES' | 'NO') => {
        setEvents(prev => prev.map(evt => {
            if (evt.id === eventId) {
                return { ...evt, myRsvp: status };
            }
            return evt;
        }));
    };

    // Lideri bul
    const maxVotes = Math.max(...options.map(o => o.voteCount));
    const winners = options.filter(o => o.voteCount === maxVotes && o.voteCount > 0);
    const isTie = winners.length > 1;
    const winner = winners[0];

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">

            {/* Banner */}
            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-full mb-4">
                    <Info className="h-6 w-6 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Canlı Demo Modu</h1>
                <p className="text-gray-300 max-w-2xl mx-auto">
                    Şu anda uygulamanın bir simülasyonunu görüntülüyorsunuz. Aşağıdaki butonlara tıklayarak oy verebilir,
                    etkinliklere katılım durumunuzu değiştirebilirsiniz. Bu veriler sadece sizin tarayıcınızda geçici olarak tutulur.
                </p>
                <div className="mt-6">
                    <Link to="/register" className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-gray-100 transition shadow-lg">
                        Hesap Oluştur ve Başla
                    </Link>
                </div>
            </div>

            {/* --- ETKİNLİKLER --- */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-sm">
                    <Calendar className="h-4 w-4" />
                    Yaklaşan Etkinlikler
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map(evt => (
                        <div key={evt.id} className="relative group overflow-hidden rounded-3xl border border-white/10 bg-gray-900 shadow-2xl">
                            {/* EKLENDİ: Etkinlik Arkaplan Görseli */}
                            {evt.backdropPath && (
                                <div className="absolute inset-0">
                                    <img
                                        src={`${IMG_BASE}/w780${evt.backdropPath}`}
                                        alt="Backdrop"
                                        className="w-full h-full object-cover opacity-40 transition-opacity group-hover:opacity-50"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-transparent opacity-50 pointer-events-none" />

                            <div className="p-6 flex flex-col h-full relative z-10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center justify-center bg-gray-800/80 border border-white/10 rounded-xl p-2 min-w-[3.5rem] backdrop-blur-md">
                                            <span className="text-xs font-bold text-gray-400 uppercase">BUGÜN</span>
                                            <span className="text-xl font-bold text-white">21</span>
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold flex items-center gap-1.5 drop-shadow-md">
                                                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                                                21:00
                                            </div>
                                            <div className="text-xs text-gray-300 capitalize drop-shadow-md">Cuma</div>
                                        </div>
                                    </div>
                                    {evt.myRsvp === 'YES' && <span className="px-2 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold shadow-lg">KATILIYORSUN</span>}
                                    {evt.myRsvp === 'NO' && <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold backdrop-blur-md">KATILMIYORSUN</span>}
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">{evt.title}</h3>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-indigo-200 bg-indigo-900/40 w-fit px-2 py-1 rounded-md border border-indigo-500/30 backdrop-blur-md">
                                        <Film className="h-3.5 w-3.5" />
                                        <span>{evt.movieTitle}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                                        <span>{evt.locationText}</span>
                                    </div>
                                </div>

                                {/* Katılımcılar */}
                                <div className="flex items-center gap-2 mb-6 pt-4 border-t border-white/10">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {evt.participants.map(p => (
                                            <div key={p.userId} className="inline-flex h-8 w-8 rounded-full ring-2 ring-gray-900 bg-gray-700 items-center justify-center text-xs font-bold text-white">
                                                {p.displayName.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400 ml-1 font-medium">+3 kişi geliyor</span>
                                </div>

                                {/* Aksiyonlar */}
                                <div className="flex gap-3 mt-auto">
                                    <button
                                        onClick={() => handleRsvp(evt.id, 'YES')}
                                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2 ${evt.myRsvp === 'YES' ? 'bg-emerald-600 text-white cursor-default shadow-lg' : 'bg-gray-800/80 hover:bg-emerald-600 hover:text-white text-gray-300 border border-white/10 backdrop-blur-sm'}`}
                                    >
                                        <Check className="h-4 w-4" /> Geliyorum
                                    </button>
                                    <button
                                        onClick={() => handleRsvp(evt.id, 'NO')}
                                        className={`px-4 rounded-xl text-sm font-medium transition ${evt.myRsvp === 'NO' ? 'bg-red-500/20 text-red-400 border border-red-500/50 backdrop-blur-sm' : 'bg-gray-800/80 hover:bg-red-500/20 hover:text-red-400 text-gray-400 border border-white/10 backdrop-blur-sm'}`}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* --- ANKET --- */}
            <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 font-semibold uppercase tracking-wider text-sm mb-1">
                            <span className="text-lg">🗳️</span>
                            Oylama Devam Ediyor
                        </div>
                        <h2 className="text-2xl font-bold text-white">Bu Hafta Sonu Ne İzleyelim?</h2>
                    </div>
                </div>

                {/* Lider Panosu */}
                {winners.length > 0 && (
                    <div className={`relative overflow-hidden p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl ${isTie ? 'bg-amber-900/20 border-amber-500/30' : 'bg-gray-900 border-indigo-500/30'}`}>

                        {/* EKLENDİ: Lider Film Arkaplanı */}
                        {!isTie && winner.backdropPath && (
                            <div className="absolute inset-0">
                                <img
                                    src={`${IMG_BASE}/w1280${winner.backdropPath}`}
                                    alt="Winner"
                                    className="w-full h-full object-cover opacity-40"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
                            </div>
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg backdrop-blur-md ${isTie ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}`}>
                                <Trophy className="h-8 w-8" />
                            </div>
                            <div>
                                <div className={`text-xs font-bold uppercase tracking-wider mb-1 drop-shadow-md ${isTie ? 'text-amber-400' : 'text-indigo-300'}`}>
                                    {isTie ? 'ÇEKİŞMELİ DURUM!' : 'ŞU ANKİ LİDER'}
                                </div>
                                <div className="text-white font-bold text-2xl leading-none drop-shadow-lg">
                                    {isTie ? `${winners.length} Film Zirvede` : winners[0].title}
                                </div>
                                <div className="text-gray-300 text-sm mt-1 drop-shadow-md">{winners[0].voteCount} oy ile</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Film Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {options.map((opt) => {
                        const isWinner = winners.some(w => w.id === opt.id);
                        return (
                            <div
                                key={opt.id}
                                className={`relative group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 bg-gray-900 ${
                                    opt.isVotedByMe
                                        ? 'border-indigo-500 shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)] ring-1 ring-indigo-500/50 scale-[1.02] z-10'
                                        : 'border-white/10 hover:border-white/30 hover:-translate-y-1 hover:shadow-xl'
                                }`}
                            >
                                {/* Poster Area */}
                                <div className="aspect-[2/3] w-full relative overflow-hidden bg-gray-800">
                                    <img
                                        src={`${IMG_BASE}/w500${opt.posterPath}`}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={opt.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />

                                    {isWinner && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <div className={`text-white text-[10px] font-black px-2 py-1 rounded shadow-lg flex items-center gap-1 backdrop-blur-md ${isTie ? 'bg-amber-500' : 'bg-indigo-500'}`}>
                                                <Trophy className="h-3 w-3" /> {isTie ? 'LİDER' : '#1'}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 flex-1 flex flex-col relative">
                                    <div className="absolute -top-10 left-4 right-4 text-shadow-sm pointer-events-none">
                                        <div className="flex items-center gap-1.5 text-white/90 font-bold text-lg">
                                            <span className="text-yellow-400 drop-shadow-md">★</span>
                                            {opt.voteCount}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-gray-100 text-sm leading-tight line-clamp-2 mb-2 min-h-[2.5rem]">
                                        {opt.title}
                                    </h3>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>{opt.releaseYear}</span>
                                        <span className="flex items-center gap-1 truncate max-w-[80px]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                            {opt.addedBy}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => handleVote(opt.id)}
                                        className={`mt-auto w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                                            opt.isVotedByMe
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 cursor-default'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        {opt.isVotedByMe ? (
                                            <><Check className="h-3.5 w-3.5" /> Oy Verildi</>
                                        ) : (
                                            'Oy Ver'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
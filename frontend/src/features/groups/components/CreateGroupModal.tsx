import { useState } from 'react';
import { X, Loader2, Users, Globe, Lock, Calendar, Clock, MapPin } from 'lucide-react';
import { createGroup } from '@/api/groups';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateGroupModal({ onClose, onSuccess }: Props) {
    const [name, setName] = useState('');

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    const [visibility, setVisibility] = useState<'PUBLIC' | 'LINK' | 'PRIVATE'>('PUBLIC');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        const fullDescription = [
            date ? `📅 Tarih: ${date}` : '',
            time ? `⏰ Saat: ${time}` : '',
            location ? `📍 Yer: ${location}` : '',
            notes ? `📝 Not: ${notes}` : ''
        ].filter(Boolean).join('\n');

        const res = await createGroup({
            name,
            description: fullDescription,
            visibility
        });

        setLoading(false);

        if (res.ok) {
            onSuccess();
            onClose();
        } else {
            setError(res.error || 'Grup oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-2xl flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        Etkinlik Oluştur
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {/* Grup Adı */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Etkinlik / Grup Adı <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Örn: Cuma Korku Gecesi"
                            className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-4 py-3 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            autoFocus
                        />
                    </div>

                    {/* Tarih - Saat - Yer (Yan yana) */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Tarih
                            </label>
                            <input
                                type="text"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                placeholder="Örn: Bu Cuma"
                                className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                                <Clock className="h-3 w-3" /> Saat
                            </label>
                            <input
                                type="text"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                placeholder="Örn: 20:00"
                                className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Yer / Platform
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                            placeholder="Örn: Discord, Ahmet'in evi"
                            className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition"
                        />
                    </div>

                    {/* Notlar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            Ekstra Notlar
                        </label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Cipsleri kim alıyor?"
                            rows={2}
                            className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-4 py-2 text-sm text-white focus:border-indigo-500 outline-none transition resize-none"
                        />
                    </div>

                    {/* Gizlilik Seçimi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Gizlilik Ayarı
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setVisibility('PUBLIC')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${visibility === 'PUBLIC' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-700'}`}
                            >
                                <Globe className="h-6 w-6 mb-1" />
                                <span className="text-xs font-bold">Herkese Açık</span>
                                <span className="text-[10px] opacity-70">Keşfet'te görünür</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setVisibility('LINK')}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${visibility === 'LINK' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-700'}`}
                            >
                                <Lock className="h-6 w-6 mb-1" />
                                <span className="text-xs font-bold">Link ile Katılım</span>
                                <span className="text-[10px] opacity-70">Sadece linki olanlar</span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !name.trim()}
                        className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-500/20"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Oluştur
                    </button>
                </form>
            </div>
        </div>
    );
}
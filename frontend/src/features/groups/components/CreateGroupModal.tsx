import { useState } from 'react';
import { X, Loader2, Users, Globe, Lock, MapPin, Laptop } from 'lucide-react';
import { createGroup } from '@/api/groups';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-day-picker/style.css';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateGroupModal({ onClose, onSuccess }: Props) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');

    // Detaylar
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [time, setTime] = useState('20:00');
    const [eventType, setEventType] = useState<'ONLINE' | 'PHYSICAL'>('ONLINE');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    const [visibility, setVisibility] = useState<'PUBLIC' | 'LINK' | 'PRIVATE'>('PUBLIC');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        const dateStr = selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: tr }) : 'Tarih Belirsiz';
        const typeStr = eventType === 'ONLINE' ? '🌐 Online' : '📍 Fiziksel Buluşma';

        // Bilgileri Description alanına formatlı şekilde gömüyoruz
        const fullDescription = [
            `${typeStr}`,
            `📅 ${dateStr} - ⏰ ${time}`,
            location ? (eventType === 'ONLINE' ? `🔗 Link: ${location}` : `📍 Adres: ${location}`) : '',
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
            setError(res.error || 'Hata oluştu.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        {step === 1 ? 'Grup Bilgileri' : 'Zaman ve Yer'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">{error}</div>}

                    {step === 1 && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Grup Adı</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Matrix Maratonu" className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-4 py-3 text-white focus:border-indigo-500 outline-none" autoFocus />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Gizlilik</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setVisibility('PUBLIC')} className={`flex flex-col items-center p-4 rounded-xl border transition-all ${visibility === 'PUBLIC' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-white/5 text-gray-400'}`}>
                                        <Globe className="h-6 w-6 mb-2" />
                                        <span className="font-bold text-sm">Herkese Açık</span>
                                        <span className="text-[10px] opacity-80">Keşfet'te görünür</span>
                                    </button>
                                    <button onClick={() => setVisibility('LINK')} className={`flex flex-col items-center p-4 rounded-xl border transition-all ${visibility === 'LINK' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-white/5 text-gray-400'}`}>
                                        <Lock className="h-6 w-6 mb-2" />
                                        <span className="font-bold text-sm">Link ile Katılım</span>
                                        <span className="text-[10px] opacity-80">Sadece linki olanlar</span>
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button onClick={() => setStep(2)} disabled={!name.trim()} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition">İleri: Zaman Seçimi</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Tarih Seç</label>
                                <div className="rounded-xl border border-white/10 bg-gray-800/50 p-2 inline-block">
                                    <DayPicker mode="single" selected={selectedDate} onSelect={setSelectedDate} locale={tr} styles={{ caption: { color: 'white' }, head_cell: { color: '#9ca3af' }, day: { color: 'white' }, nav_button: { color: 'white' } }} />
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Tür</label>
                                    <div className="flex bg-gray-800 p-1 rounded-lg">
                                        <button onClick={() => setEventType('ONLINE')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${eventType === 'ONLINE' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}><Laptop className="h-4 w-4" /> Online</button>
                                        <button onClick={() => setEventType('PHYSICAL')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition ${eventType === 'PHYSICAL' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}><MapPin className="h-4 w-4" /> Fiziksel</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="block text-xs text-gray-400 mb-1">Saat</label><input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" /></div>
                                    <div><label className="block text-xs text-gray-400 mb-1">{eventType === 'ONLINE' ? 'Platform' : 'Konum'}</label><input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder={eventType === 'ONLINE' ? 'Discord...' : 'Ev...'} className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500" /></div>
                                </div>
                                <div><label className="block text-xs text-gray-400 mb-1">Not</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none" /></div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700">Geri</button>
                                    <button onClick={handleSubmit} disabled={loading} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 disabled:opacity-50">{loading && <Loader2 className="h-4 w-4 animate-spin" />} Oluştur</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
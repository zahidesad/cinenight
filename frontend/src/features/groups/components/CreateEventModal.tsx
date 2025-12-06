import { useState } from 'react';
import { X, Loader2, MapPin, Clock } from 'lucide-react';
import { createEvent } from '@/api/events';
import { closePoll } from '@/api/polls';
import { DayPicker } from 'react-day-picker';
import { tr } from 'date-fns/locale';
import 'react-day-picker/style.css';

type Props = {
    groupId: number;
    pollId: number;
    movie: { tmdbId: number; title: string };
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateEventModal({ groupId, pollId, movie, onClose, onSuccess }: Props) {
    const [selectedDate, setSelectedDate] = useState<Date>();
    const [time, setTime] = useState('21:00');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!selectedDate) return;

        setLoading(true);
        const [hours, minutes] = time.split(':').map(Number);
        const startDate = new Date(selectedDate);
        startDate.setHours(hours, minutes);

        // 1. Etkinliği Oluştur
        const res = await createEvent({
            groupId,
            title: `${movie.title} - İzleme Gecesi`,
            tmdbId: movie.tmdbId,
            startTime: startDate.toISOString(),
            locationText: location || 'Discord / Online'
        });

        if (res.ok) {
            // 2. Başarılıysa Anketi Kapat (Böylece buton kaybolur)
            await closePoll(pollId);

            setLoading(false);
            onSuccess();
            onClose();
        } else {
            setLoading(false);
            alert(res.error || "Etkinlik oluşturulamadı.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h3 className="font-bold text-white">Etkinlik Planla</h3>
                    <button onClick={onClose}><X className="h-5 w-5 text-gray-400" /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <div className="text-sm text-gray-400">Kazanan Film</div>
                        <div className="text-xl font-bold text-emerald-400">{movie.title}</div>
                    </div>

                    <div className="flex justify-center rounded-xl bg-gray-800/50 border border-white/5 p-2">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={tr}
                            // EKLENDİ: Bugünden önceki tarihleri engelle
                            disabled={{ before: new Date() }}
                            styles={{ caption: { color: 'white' }, head_cell: { color: '#9ca3af' }, day: { color: 'white' }, nav_button: { color: 'white' } }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><Clock className="h-3 w-3"/> Saat</label>
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin className="h-3 w-3"/> Yer/Platform</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Discord..." className="w-full bg-gray-800 border border-white/10 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedDate}
                        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin h-4 w-4" />}
                        Onayla ve Anketi Bitir
                    </button>
                </div>
            </div>
        </div>
    );
}
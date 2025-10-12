import { useMemo, useState } from 'react';
import { CalendarRange, Check, ChevronLeft, ChevronRight, Download, Clock, MapPin } from 'lucide-react';
import { buildICS, downloadICS } from '@/utils/ical';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { addHours, setHours, setMinutes } from 'date-fns';
import { tr } from 'date-fns/locale';


type Step = 1 | 2 | 3;

const sampleMovies = [
    { id: 'inception', title: 'Inception (2010)' },
    { id: 'lalaland', title: 'La La Land (2016)' },
    { id: 'parasite', title: 'Parasite (2019)' },
];

const timeSlots = ['18:00','19:00','20:00','21:00','22:00'];

export default function TryDemoPage() {
    const [step, setStep] = useState<Step>(1);
    const [groupName, setGroupName] = useState('Cuma Akşamı Tayfası');
    const [selectedMovie, setSelectedMovie] = useState<string>('inception');

    // takvim/saat
    const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string>('20:00');
    const [durationHrs, setDurationHrs] = useState<number>(2);

    const [location, setLocation] = useState<string>('Ev ortamı · Beşiktaş');
    const [title, setTitle] = useState<string>('CineNight – Movie Night');
    const [note, setNote] = useState<string>('Popcorn’u unutmayın 🍿');

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const selectedMovieTitle = useMemo(
        () => sampleMovies.find(m => m.id === selectedMovie)?.title ?? '',
        [selectedMovie]
    );

    const canNext1 = groupName.trim().length > 0;
    const canNext2 = !!selectedMovie;
    const canCreate = !!selectedDay && !!selectedTime;

    // compose start/end
    const startDate = useMemo(() => {
        if (!selectedDay || !selectedTime) return undefined;
        const [h, m] = selectedTime.split(':').map(Number);
        return setMinutes(setHours(selectedDay, h), m);
    }, [selectedDay, selectedTime]);

    const endDate = useMemo(() => (startDate ? addHours(startDate, durationHrs) : undefined), [startDate, durationHrs]);

    const handleDownload = () => {
        const s = startDate!;
        const e = endDate!;
        const ics = buildICS({
            title: title || `CineNight – ${selectedMovieTitle}`,
            description: `${groupName}\n${note}`,
            start: s,
            end: e,
            location: location || undefined,
            url: 'https://cinenight.local/demo',
        });
        downloadICS(ics, 'cinenight-demo.ics');
    };

    const reset = () => {
        setStep(1);
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-2 text-gray-400">
                <CalendarRange className="h-5 w-5" />
                <span>Canlı Demo</span>
            </div>

            {/* steps header */}
            <div className="mb-6 grid grid-cols-3 gap-2 text-sm">
                <div className={`rounded-lg p-2 text-center ${step >= 1 ? 'bg-indigo-600/20 text-indigo-200' : 'bg-gray-800 text-gray-400'}`}>1) Grup</div>
                <div className={`rounded-lg p-2 text-center ${step >= 2 ? 'bg-indigo-600/20 text-indigo-200' : 'bg-gray-800 text-gray-400'}`}>2) Oylama</div>
                <div className={`rounded-lg p-2 text-center ${step >= 3 ? 'bg-indigo-600/20 text-indigo-200' : 'bg-gray-800 text-gray-400'}`}>3) Plan & Takvim</div>
            </div>

            {/* step 1 */}
            {step === 1 && (
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">Grup oluştur</h2>
                    <input
                        className="w-full rounded-lg border border-white/10 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500"
                        placeholder="Grup adı"
                        value={groupName}
                        onChange={e => setGroupName(e.target.value)}
                    />
                    <div className="mt-6 flex items-center justify-between">
                        <span className="text-sm text-gray-400">Örn: “Cuma Akşamı Tayfası”</span>
                        <button
                            disabled={!canNext1}
                            onClick={() => setStep(2)}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${canNext1 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-700 text-gray-400'}`}
                        >
                            Devam <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* step 2 */}
            {step === 2 && (
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">Filmleri oyla</h2>
                    <div className="space-y-3">
                        {sampleMovies.map(m => (
                            <label key={m.id} className={`flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 ${selectedMovie === m.id ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-white/10 bg-gray-800/60'}`}>
                                <span className="text-sm text-gray-200">{m.title}</span>
                                {selectedMovie === m.id ? (
                                    <Check className="h-4 w-4 text-emerald-400" />
                                ) : (
                                    <input type="radio" name="movie" onChange={() => setSelectedMovie(m.id)} />
                                )}
                            </label>
                        ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                        <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700">
                            <ChevronLeft className="h-4 w-4" /> Geri
                        </button>
                        <button
                            disabled={!canNext2}
                            onClick={() => setStep(3)}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${canNext2 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-700 text-gray-400'}`}
                        >
                            Devam <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* step 3 */}
            {step === 3 && (
                <div className="rounded-2xl border border-white/10 bg-gray-900/60 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">Plan & takvim</h2>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Sol: Gün seçimi */}
                        <div className="rounded-xl border border-white/10 bg-gray-950/40 p-3">
                            <DayPicker
                                mode="single"
                                selected={selectedDay}
                                onSelect={setSelectedDay}
                                weekStartsOn={1}
                                showOutsideDays
                                fixedWeeks
                                captionLayout="label"
                                locale={tr}
                                styles={{
                                    caption_label: { fontWeight: 600 },
                                    head_cell: { fontSize: '0.8rem' },
                                    day: { fontSize: '0.95rem' },
                                }}
                            />
                        </div>

                        {/* Sağ: Saat/Detay */}
                        <div className="space-y-4">
                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                                    <Clock className="h-4 w-4" /> Saat
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {timeSlots.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setSelectedTime(t)}
                                            className={`rounded-lg px-3 py-2 text-sm ${selectedTime===t ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 text-sm text-gray-300">Süre</div>
                                <div className="flex gap-2">
                                    {[2,3,4].map(h => (
                                        <button
                                            key={h}
                                            onClick={() => setDurationHrs(h)}
                                            className={`rounded-lg px-3 py-2 text-sm ${durationHrs===h ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-200 hover:bg-gray-700'}`}
                                        >
                                            {h} saat
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                                    <MapPin className="h-4 w-4" /> Konum
                                </div>
                                <input
                                    className="w-full rounded-lg border border-white/10 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500"
                                    placeholder="Konum"
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="mb-2 text-sm text-gray-300">Başlık</div>
                                <input
                                    className="w-full rounded-lg border border-white/10 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500"
                                    placeholder="Event başlığı"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <div className="mb-2 text-sm text-gray-300">Not</div>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-lg border border-white/10 bg-gray-800 p-3 text-white outline-none focus:border-indigo-500"
                                    placeholder="Not (opsiyonel)"
                                    value={note}
                                    onChange={e => setNote(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-white/10 bg-gray-950/50 p-4 text-sm text-gray-300 md:grid-cols-2">
                        <div><span className="text-gray-400">Grup:</span> {groupName}</div>
                        <div><span className="text-gray-400">Film:</span> {selectedMovieTitle}</div>
                        <div><span className="text-gray-400">Zaman dilimi:</span> {tz}</div>
                        {startDate && endDate && (
                            <div className="md:col-span-2">
                                <span className="text-gray-400">Saat:</span> {startDate.toLocaleString()} – {endDate.toLocaleTimeString()}
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700">
                            <ChevronLeft className="h-4 w-4" /> Geri
                        </button>
                        <div className="flex gap-2">
                            <button onClick={reset} className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-white hover:bg-gray-700">Sıfırla</button>
                            <button
                                disabled={!canCreate}
                                onClick={handleDownload}
                                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${canCreate ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-700 text-gray-400'}`}
                            >
                                <Download className="h-4 w-4" /> Takvime ekle (.ics)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { Link } from 'react-router-dom';
import { Users, Vote, CalendarRange, Share2, CheckCircle2, ArrowRight } from 'lucide-react';

function Feature({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
    return (
        <div className="rounded-xl border border-white/10 bg-gray-900/40 p-5 shadow-lg">
            <div className="mb-3 inline-flex rounded-lg bg-indigo-600/20 p-2">
                <Icon className="h-5 w-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-gray-400">{desc}</p>
        </div>
    );
}

function PollPreviewCard() {
    const options = [
        { title: 'Inception (2010)', votes: 8 },
        { title: 'La La Land (2016)', votes: 5 },
        { title: 'Parasite (2019)', votes: 3 },
    ];
    const winner = 0;

    return (
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gray-900/70 p-5 shadow-2xl backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h4 className="text-lg font-semibold text-white">Hangi filmi izleyelim?</h4>
                    <p className="text-xs text-gray-400">Herkes bir oy veriyor · en çok oyu alan kazanır</p>
                </div>
                <span className="rounded-md bg-emerald-600/20 px-2 py-1 text-xs text-emerald-300">Canlı örnek</span>
            </div>
            <div className="space-y-3">
                {options.map((o, i) => (
                    <div key={o.title} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${i===winner ? 'border-emerald-500/60 bg-emerald-500/10' : 'border-white/10 bg-gray-800/60'}`}>
                        <span className="text-sm text-gray-200">{o.title}</span>
                        <div className="flex items-center gap-2">
                            {i===winner && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                            <span className="rounded-md bg-gray-900/60 px-2 py-0.5 text-xs text-gray-300">{o.votes} oy</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
                <button className="rounded-md bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700">Bağlantı kopyala</button>
                <Link to="/try" className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Hemen Dene <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <div className="relative">
            {/* arka plan */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="mx-auto h-72 w-72 translate-y-8 rounded-full bg-fuchsia-600/20 blur-3xl" />
                <div className="mx-auto mt-[-6rem] h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
            </div>

            {/* HERO */}
            <section className="flex flex-col items-center gap-8 pb-10 pt-6 text-center md:pt-2">
                <h1 className="max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-white md:text-5xl">
                    Film gecelerini birlikte seçin, tek tıkla planlayın
                </h1>
                <p className="max-w-2xl text-pretty text-lg text-gray-300">
                    Grubunu kur, aday filmleri ekle, herkes oy versin. Kazanan film için tarih ve yeri belirle;
                    katılımcılar “Geleceğim / Gelemiyorum / Belki” ile yanıtlasın. İstersen tek dokunuşla
                    <span className="text-white"> takvimine ekle</span>.
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                    <Link to="/try" className="rounded-lg bg-fuchsia-600 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-700">Hemen Dene</Link>
                    <div className="flex gap-3">
                        <Link to="/register" className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">Kayıt Ol</Link>
                        <Link to="/login" className="rounded-lg bg-gray-800 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-700">Giriş Yap</Link>
                    </div>
                </div>

                <div className="mt-8">
                    <PollPreviewCard />
                </div>
            </section>

            {/* ÖZELLİKLER */}
            <section id="features" className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                <Feature icon={Users} title="Kolay grup" desc="Arkadaşlarını ekle, istersen bağlantıyla davet et." />
                <Feature icon={Vote} title="Hızlı oylama" desc="Herkes bir oy verir; en çok oyu alan film kazanır." />
                <Feature icon={CalendarRange} title="Takvime ekle" desc="Planı tek dosyayla Google/Apple/Outlook takvimine at." />
                <Feature icon={Share2} title="Paylaşılabilir anket" desc="Dışarıyla paylaşabileceğin canlı anket bağlantısı." />
            </section>

            {/* NASIL ÇALIŞIR */}
            <section id="flow" className="mt-14">
                <h2 className="mb-6 text-center text-2xl font-bold text-white">Nasıl çalışır?</h2>
                <ol className="mx-auto grid max-w-3xl grid-cols-1 gap-3 text-sm text-gray-300 md:grid-cols-4">
                    <li className="rounded-xl border border-white/10 bg-gray-900/50 p-4 text-center">
                        <span className="block font-semibold text-white">1) Grup</span>
                        Arkadaşlarını davet et
                    </li>
                    <li className="rounded-xl border border-white/10 bg-gray-900/50 p-4 text-center">
                        <span className="block font-semibold text-white">2) Oylama</span>
                        Filmleri ekle, oy verin
                    </li>
                    <li className="rounded-xl border border-white/10 bg-gray-900/50 p-4 text-center">
                        <span className="block font-semibold text-white">3) Plan</span>
                        Tarih ve yeri belirle
                    </li>
                    <li className="rounded-xl border border-white/10 bg-gray-900/50 p-4 text-center">
                        <span className="block font-semibold text-white">4) Kimler geliyor?</span>
                        Herkes durumunu işaretlesin
                    </li>
                </ol>
            </section>

            {/* CTA */}
            <section className="mt-12 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-gray-400">Dakikalar içinde deneyimle</p>
                <Link to="/try" className="inline-flex items-center gap-2 rounded-lg bg-fuchsia-600 px-6 py-3 text-sm font-semibold text-white hover:bg-fuchsia-700">
                    Canlı Demo’yu Aç <ArrowRight className="h-4 w-4" />
                </Link>
            </section>
        </div>
    );
}

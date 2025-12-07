import { useState } from 'react';
import { X, Loader2, Users, Globe, Lock, AlignLeft } from 'lucide-react';
import { createGroup } from '@/api/groups';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateGroupModal({ onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'PUBLIC' | 'LINK' | 'PRIVATE'>('PUBLIC');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        const res = await createGroup({
            name,
            description: description.trim() || 'Film geceleri için oluşturulmuş bir grup.',
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
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-white/10 p-5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Users className="h-6 w-6 text-indigo-500" />
                        Yeni Grup Oluştur
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">{error}</div>}

                    <div className="space-y-5">
                        {/* Grup Adı */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Grup Adı</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Örn: Matrix Maratonu"
                                className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-4 py-3 text-white focus:border-indigo-500 outline-none placeholder:text-gray-600"
                                autoFocus
                            />
                        </div>

                        {/* Açıklama Alanı (YENİ EKLENDİ) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-2">
                                <AlignLeft className="h-4 w-4 text-gray-500" />
                                Açıklama <span className="text-xs text-gray-600 font-normal">(İsteğe bağlı)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Bu grup ne hakkında? Örn: Sadece korku filmleri izliyoruz..."
                                rows={3}
                                className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-4 py-3 text-white focus:border-indigo-500 outline-none resize-none placeholder:text-gray-600"
                            />
                        </div>

                        {/* Gizlilik Seçimi */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Gizlilik</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setVisibility('PUBLIC')}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-all ${visibility === 'PUBLIC' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-750 hover:border-white/10'}`}
                                >
                                    <Globe className="h-6 w-6 mb-2" />
                                    <span className="font-bold text-sm">Herkese Açık</span>
                                    <span className="text-[10px] opacity-70">Keşfet'te görünür</span>
                                </button>
                                <button
                                    onClick={() => setVisibility('LINK')}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-all ${visibility === 'LINK' ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-750 hover:border-white/10'}`}
                                >
                                    <Lock className="h-6 w-6 mb-2" />
                                    <span className="font-bold text-sm">Link ile Katılım</span>
                                    <span className="text-[10px] opacity-70">Sadece davetle</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!name.trim() || loading}
                            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 mt-2"
                        >
                            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                            Grubu Kur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
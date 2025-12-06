import { useState } from 'react';
import { X, Loader2, Users, Globe, Lock } from 'lucide-react';
import { createGroup } from '@/api/groups';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateGroupModal({ onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [visibility, setVisibility] = useState<'PUBLIC' | 'LINK' | 'PRIVATE'>('PUBLIC');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        const res = await createGroup({
            name,
            description: 'Yeni oluşturulan grup.',
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

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Grup Adı</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Örn: Matrix Maratonu"
                                className="w-full rounded-xl bg-gray-800/50 border border-white/10 px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Gizlilik</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setVisibility('PUBLIC')}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-all ${visibility === 'PUBLIC' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-750'}`}
                                >
                                    <Globe className="h-6 w-6 mb-2" />
                                    <span className="font-bold text-sm">Herkese Açık</span>
                                    <span className="text-[10px] opacity-80">Keşfet'te görünür</span>
                                </button>
                                <button
                                    onClick={() => setVisibility('LINK')}
                                    className={`flex flex-col items-center p-4 rounded-xl border transition-all ${visibility === 'LINK' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800 border-white/5 text-gray-400 hover:bg-gray-750'}`}
                                >
                                    <Lock className="h-6 w-6 mb-2" />
                                    <span className="font-bold text-sm">Link ile Katılım</span>
                                    <span className="text-[10px] opacity-80">Sadece davetle</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!name.trim() || loading}
                            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
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
import { useState } from 'react';
import { X, Loader2, Users } from 'lucide-react';
import { createGroup } from '@/api/groups';

type Props = {
    onClose: () => void;
    onSuccess: () => void;
};

export default function CreateGroupModal({ onClose, onSuccess }: Props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        const res = await createGroup({ name, description });

        setLoading(false);

        if (res.ok) {
            onSuccess();
            onClose();
        } else {
            setError(res.error || 'Grup oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="w-full max-w-md overflow-hidden rounded-2xl bg-gray-900 border border-white/10 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-400" />
                        Yeni Grup Oluştur
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Grup Adı
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Örn: Cuma Sinema Kulübü"
                            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Açıklama (Opsiyonel)
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Bu grup ne hakkında?"
                            rows={3}
                            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition resize-none"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 transition"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name.trim()}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-indigo-500/20"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
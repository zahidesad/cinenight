import { useEffect, useState } from 'react';
import { fetchExploreGroups, addMember, type GroupDto } from '@/api/groups';
import { UserPlus, Loader2, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { me } from '@/api/auth';

export default function ExplorePage() {
    const [groups, setGroups] = useState<GroupDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [joiningId, setJoiningId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const res = await fetchExploreGroups();
            if (res.ok && res.data) {
                setGroups(res.data);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleJoin = async (group: GroupDto) => {
        setJoiningId(group.id);

        // 1. Kullanıcı bilgisini al
        const userRes = await me();
        if (!userRes.ok) {
            navigate(`/login?redirect=/explore`);
            return;
        }

        // 2. Katılma isteği at
        const res = await addMember(group.id, userRes.data!.email);
        if (res.ok) {
            navigate(`/groups/${group.id}`);
        } else {
            alert(res.error || "Katılamadın.");
            setJoiningId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center py-8">
                <h1 className="text-4xl font-bold text-white mb-2">Toplulukları Keşfet</h1>
                <p className="text-gray-400 max-w-xl mx-auto">
                    Yeni insanlarla tanış, film zevkine uygun gruplara katıl ve birlikte izle.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map(g => (
                        <div key={g.id} className="group relative flex flex-col rounded-2xl border border-white/10 bg-gray-900/60 p-6 hover:bg-gray-900 transition-all hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Globe className="h-6 w-6" />
                                </div>
                                <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 border border-gray-700">
                                    {g.visibility}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{g.name}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2 mb-6 h-10">
                                {g.description || "Bu grup için açıklama girilmemiş."}
                            </p>

                            <button
                                onClick={() => handleJoin(g)}
                                disabled={joiningId === g.id}
                                className="mt-auto w-full py-2.5 rounded-xl bg-white/5 hover:bg-indigo-600 hover:text-white text-gray-300 font-medium transition-all flex items-center justify-center gap-2 border border-white/5 hover:border-transparent"
                            >
                                {joiningId === g.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                                Gruba Katıl
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
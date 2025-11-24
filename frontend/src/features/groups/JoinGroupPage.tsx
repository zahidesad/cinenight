import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { joinGroup, fetchMyGroups } from '@/api/groups';
import { Loader2, Users, ShieldAlert } from 'lucide-react';
import { me } from '@/api/auth';

export default function JoinGroupPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'CHECKING' | 'JOINING' | 'ERROR'>('CHECKING');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function checkAndJoin() {
            if (!groupId) return;

            // 1. Giriş yapmış mı?
            const userRes = await me();
            if (!userRes.ok) {
                // Giriş yapmamışsa login'e at, dönüşte buraya gelsin
                navigate(`/login?redirect=/join/${groupId}`);
                return;
            }

            // 2. Zaten üye mi?
            const groupsRes = await fetchMyGroups();
            if (groupsRes.ok && groupsRes.data?.find(g => g.id === Number(groupId))) {
                // Zaten üye, direkt detaya git
                navigate(`/groups/${groupId}`);
                return;
            }

            // 3. Katılma İsteği At (DÜZELTME: joinGroup kullanıldı)
            setStatus('JOINING');
            const joinRes = await joinGroup(Number(groupId));

            if (joinRes.ok) {
                navigate(`/groups/${groupId}`);
            } else {
                setStatus('ERROR');
                setErrorMsg(joinRes.error || "Gruba katılırken bir sorun oluştu.");
            }
        }

        checkAndJoin();
    }, [groupId, navigate]);

    if (status === 'ERROR') {
        return (
            <div className="flex h-screen items-center justify-center p-4 bg-gray-950">
                <div className="text-center max-w-md space-y-4 p-8 rounded-2xl bg-gray-900 border border-white/10">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
                        <ShieldAlert className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Katılma Başarısız</h2>
                    <p className="text-gray-400">{errorMsg}</p>
                    <button onClick={() => navigate('/')} className="text-indigo-400 hover:text-indigo-300 font-medium">Ana Sayfaya Dön</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-950 p-4">
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-gray-900 p-8 text-center shadow-2xl">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-400">
                    <Users className="h-8 w-8" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-white">Gruba Katılınıyor</h2>
                <p className="mb-6 text-gray-400">Seni ekibe dahil ediyoruz, lütfen bekle...</p>
                <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                </div>
            </div>
        </div>
    );
}
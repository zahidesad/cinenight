import { useEffect, useState } from 'react';
import { me, type UserDto } from '@/api/auth';
import { User, Mail, Save, Loader2, AlertTriangle, CheckCircle, Lock, Key } from 'lucide-react';
import { changePassword, updateProfile } from "@/api/user";
import { useTranslation } from 'react-i18next';

export default function ProfilePage() {
    const { t } = useTranslation();

    // --- Profil State ---
    const [user, setUser] = useState<UserDto | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    // --- Parola State ---
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [savingPw, setSavingPw] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        me().then(res => {
            if (res.ok && res.data) {
                setUser(res.data);
                setName(res.data.displayName);
                setEmail(res.data.email);
            }
            setLoading(false);
        });
    }, []);

    // Profil Güncelleme
    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileMsg(null);

        const res = await updateProfile({ displayName: name, email: email });
        setSavingProfile(false);

        if (res.ok) {
            if (email !== user?.email) {
                setProfileMsg({ type: 'info', text: t('profile.msg_profile_updated_email') });
            } else {
                setProfileMsg({ type: 'success', text: t('profile.msg_profile_updated') });
                setUser(res.data);
            }
        } else {
            setProfileMsg({ type: 'error', text: res.error || t('profile.msg_profile_failed') });
        }
    };

    // Parola Değiştirme
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwMsg(null);

        if (newPw.length < 6) {
            setPwMsg({ type: 'error', text: t('profile.msg_password_min') });
            return;
        }
        if (newPw !== confirmPw) {
            setPwMsg({ type: 'error', text: t('profile.msg_password_mismatch') });
            return;
        }

        setSavingPw(true);
        const res = await changePassword(currentPw, newPw);
        setSavingPw(false);

        if (res.ok) {
            setPwMsg({ type: 'success', text: t('profile.msg_password_updated') });
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } else {
            setPwMsg({ type: 'error', text: res.error || t('profile.msg_password_failed') });
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-white" /></div>;

    return (
        <div className="max-w-xl mx-auto py-10 px-4 space-y-8">
            <h1 className="text-3xl font-bold text-white">{t('profile.title')}</h1>

            {/* --- BÖLÜM 1: GENEL BİLGİLER --- */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" /> {t('profile.section_profile')}
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.fields.display_name')}</label>
                        <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 focus-within:border-indigo-500 transition-colors">
                            <User className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="bg-transparent border-none w-full py-3 text-white focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.fields.email')}</label>
                        <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 focus-within:border-indigo-500 transition-colors">
                            <Mail className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="bg-transparent border-none w-full py-3 text-white focus:outline-none"
                                required
                            />
                        </div>
                        {email !== user?.email && (
                            <p className="text-xs text-amber-400 mt-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {t('profile.email_warning')}
                            </p>
                        )}
                    </div>

                    {profileMsg && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 ${
                            profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                profileMsg.type === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                            {profileMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> :
                                profileMsg.type === 'error' ? <AlertTriangle className="w-5 h-5 shrink-0" /> :
                                    <Mail className="w-5 h-5 shrink-0" />}
                            <span className="text-sm">{profileMsg.text}</span>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={savingProfile}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {savingProfile ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                            {t('profile.save_button')}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- BÖLÜM 2: PAROLA DEĞİŞTİRME --- */}
            <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-indigo-400" /> {t('profile.section_password')}
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">{t('profile.current_password')}</label>
                        <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 focus-within:border-indigo-500">
                            <Key className="w-4 h-4 text-gray-500 mr-2" />
                            <input
                                type="password"
                                value={currentPw}
                                onChange={e => setCurrentPw(e.target.value)}
                                className="bg-transparent border-none w-full py-3 text-white focus:outline-none placeholder-gray-600"
                                placeholder={t('auth.fields.password_placeholder')}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{t('auth.fields.new_password')}</label>
                            <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 focus-within:border-indigo-500">
                                <Lock className="w-4 h-4 text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    value={newPw}
                                    onChange={e => setNewPw(e.target.value)}
                                    className="bg-transparent border-none w-full py-3 text-white focus:outline-none placeholder-gray-600"
                                    placeholder={t('profile.placeholder_min_char')}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">{t('profile.new_password_confirm')}</label>
                            <div className="flex items-center bg-gray-800 rounded-lg px-3 border border-gray-700 focus-within:border-indigo-500">
                                <Lock className="w-4 h-4 text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    value={confirmPw}
                                    onChange={e => setConfirmPw(e.target.value)}
                                    className="bg-transparent border-none w-full py-3 text-white focus:outline-none placeholder-gray-600"
                                    placeholder={t('auth.fields.password_placeholder')}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {pwMsg && (
                        <div className={`p-4 rounded-xl flex items-start gap-3 ${
                            pwMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                            {pwMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                            <span className="text-sm">{pwMsg.text}</span>
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={savingPw}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-white/10 font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {savingPw ? <Loader2 className="animate-spin w-5 h-5" /> : <Key className="w-5 h-5" />}
                            {t('profile.update_password_button')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
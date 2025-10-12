import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/api/auth';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (password.length < 6) {
            setError('Şifre en az 6 karakter olmalı.');
            return;
        }
        const res = await register(email, password, displayName);
        if (res.ok) {
            navigate('/login');
        } else {
            setError(res.error || 'Kayıt başarısız. Daha sonra tekrar dene.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-200">Hesap Oluştur</h2>
                <p className="mt-1 text-sm text-gray-400">Birlikte ne izleneceğine karar vermek artık çok kolay.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm text-gray-300">
                    Görünen ad
                    <div className="mt-1 flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3">
                        <User className="mr-2 h-4 w-4 text-gray-300" />
                        <input
                            className="w-full bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                            placeholder="Örn: Deniz"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                </label>

                <label className="block text-sm text-gray-300">
                    E-posta
                    <div className="mt-1 flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3">
                        <Mail className="mr-2 h-4 w-4 text-gray-300" />
                        <input
                            className="w-full bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                            type="email"
                            placeholder="ornek@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </label>

                <label className="block text-sm text-gray-300">
                    Şifre
                    <div className="mt-1 flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3">
                        <Lock className="mr-2 h-4 w-4 text-gray-300" />
                        <input
                            className="w-full bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                            type={showPw ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <button type="button" onClick={() => setShowPw(s => !s)} className="text-gray-300">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">En az 6 karakter önerilir.</p>
                </label>

                {error && <div className="rounded-md bg-red-900/40 p-3 text-center text-sm text-red-200">{error}</div>}

                <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    Kayıt Ol
                </button>
            </form>

            <p className="text-center text-sm text-gray-400">
                Zaten hesabın var mı?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">Giriş yap</Link>
            </p>
        </div>
    );
}
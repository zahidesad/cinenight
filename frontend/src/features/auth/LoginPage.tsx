import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, UserDto } from '@/api/auth';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
    onLoginSuccess: (user: UserDto) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const res = await login(email, password);
        if (res.ok && res.data) {
            onLoginSuccess(res.data);
            navigate('/');
        } else {
            setError(res.error || 'Giriş yapılamadı. Bilgileri kontrol et.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-200">Giriş Yap</h2>
                <p className="mt-1 text-sm text-gray-400">Film gecelerine kaldığın yerden devam et.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                        />
                        <button type="button" onClick={() => setShowPw(s => !s)} className="text-gray-300">
                            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </label>

                {error && <div className="rounded-md bg-red-900/40 p-3 text-center text-sm text-red-200">{error}</div>}

                <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    Giriş Yap
                </button>
            </form>

            <div className="flex justify-between text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300">Şifremi Unuttum</Link>
                <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">Hesap Oluştur</Link>
            </div>
        </div>
    );
}

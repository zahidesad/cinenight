import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, UserDto } from '@/api/auth';

interface LoginPageProps {
    onLoginSuccess: (user: UserDto) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            setError(res.error || 'Giriş işlemi başarısız oldu.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-gray-200">Giriş Yap</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="email"
                    placeholder="E-posta Adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="password"
                    placeholder="Şifreniz"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <div className="rounded-md bg-red-900/50 p-3 text-center text-sm text-red-300">{error}</div>}
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
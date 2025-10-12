import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '@/api/auth';

export default function RegisterPage() {
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const res = await register(email, password, displayName);
        if (res.ok) {
            navigate('/login');
        } else {
            setError(res.error || 'Kayıt işlemi başarısız oldu.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-gray-200">Hesap Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Görünen Adınız"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                />
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
                    Kayıt Ol
                </button>
            </form>
            <p className="text-center text-sm text-gray-400">
                Zaten bir hesabın var mı?{' '}
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">Giriş Yap</Link>
            </p>
        </div>
    );
}
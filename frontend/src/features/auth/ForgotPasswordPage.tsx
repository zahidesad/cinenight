import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgot } from '@/api/auth';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        const res = await forgot(email);
        if (res.ok) {
            setMessage('Şifre sıfırlama linki e-posta adresinize gönderildi.');
        } else {
            setError(res.error || 'İşlem başarısız oldu.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-200">Şifreni Sıfırla</h2>
                <p className="mt-2 text-sm text-gray-400">Sıfırlama linki için e-posta adresinizi girin.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="email"
                    placeholder="E-posta Adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <div className="rounded-md bg-red-900/50 p-3 text-center text-sm text-red-300">{error}</div>}
                {message && <div className="rounded-md bg-green-900/50 p-3 text-center text-sm text-green-300">{message}</div>}
                <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    Sıfırlama Linki Gönder
                </button>
            </form>
            <div className="text-center text-sm">
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">Giriş ekranına dön</Link>
            </div>
        </div>
    );
}
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { resetPassword } from '@/api/auth';

export default function ResetPasswordPage() {
    const location = useLocation();
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenFromUrl = params.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        if (!token) {
            setError('URL içinde token bulunamadı.');
            return;
        }
        const res = await resetPassword(token, newPassword);
        if (res.ok) {
            setMessage('Şifreniz başarıyla güncellendi.');
        } else {
            setError(res.error || 'Şifre sıfırlama işlemi başarısız oldu.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-center text-2xl font-semibold text-gray-200">Yeni Şifre Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full cursor-not-allowed rounded-lg border border-gray-600 bg-gray-700 p-3 text-gray-400 placeholder-gray-500"
                    placeholder="Token"
                    value={token}
                    readOnly // Token'ı kullanıcı değiştiremez
                />
                <input
                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="password"
                    placeholder="Yeni Şifreniz"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                {error && <div className="rounded-md bg-red-900/50 p-3 text-center text-sm text-red-300">{error}</div>}
                {message && <div className="rounded-md bg-green-900/50 p-3 text-center text-sm text-green-300">{message}</div>}
                <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    Şifreyi Güncelle
                </button>
            </form>
            {message && (
                <div className="text-center text-sm">
                    <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">Giriş Yap</Link>
                </div>
            )}
        </div>
    );
}
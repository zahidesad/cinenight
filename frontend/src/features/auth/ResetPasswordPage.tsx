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
        const res = await resetPassword(token, newPassword);
        if (res.ok) {
            setMessage('Şifreniz başarıyla güncellendi.');
        } else {
            setError(res.error || 'Şifre sıfırlama işlemi başarısız oldu.');
        }
    };

    return (
        <>
            <h2>Yeni Şifre Oluştur</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    placeholder="Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    readOnly
                />
                <input
                    type="password"
                    placeholder="Yeni Şifreniz"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <button type="submit" className="btn-primary">Şifreyi Güncelle</button>
            </form>
            {message && (
                <div className="auth-footer">
                    <Link to="/login">Giriş Yap</Link>
                </div>
            )}
        </>
    );
}
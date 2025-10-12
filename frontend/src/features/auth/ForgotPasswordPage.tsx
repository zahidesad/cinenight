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
        <>
            <h2>Şifreni Sıfırla</h2>
            <p className="subtitle">Sıfırlama linki göndereceğimiz e-posta adresinizi girin.</p>
            <form onSubmit={handleSubmit} className="auth-form">
                <input
                    type="email"
                    placeholder="E-posta Adresiniz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}
                <button type="submit" className="btn-primary">Sıfırlama Linki Gönder</button>
            </form>
            <div className="auth-footer">
                <Link to="/login">Giriş ekranına dön</Link>
            </div>
        </>
    );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgot } from '@/api/auth';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        const res = await forgot(email);
        if (res.ok) {
            setMessage(t('auth.pages.forgot_password.success'));
        } else {
            setError(res.error || t('errors.operation_failed'));
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-200">{t('auth.pages.forgot_password.title')}</h2>
                <p className="mt-1 text-sm text-gray-400">{t('auth.pages.forgot_password.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm text-gray-300">
                    {t('auth.fields.email')}
                    <div className="mt-1 flex items-center rounded-lg border border-gray-600 bg-gray-700 px-3">
                        <Mail className="mr-2 h-4 w-4 text-gray-300" />
                        <input
                            className="w-full bg-transparent py-3 text-white placeholder-gray-400 focus:outline-none"
                            type="email"
                            placeholder={t('auth.fields.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </label>

                {error && <div className="rounded-md bg-red-900/40 p-3 text-center text-sm text-red-200">{error}</div>}
                {message && <div className="rounded-md bg-emerald-900/30 p-3 text-center text-sm text-emerald-200">{message}</div>}

                <button type="submit" className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
                    {t('auth.pages.forgot_password.submit')}
                </button>
            </form>

            <div className="text-center text-sm">
                <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">{t('auth.pages.forgot_password.back_to_login')}</Link>
            </div>
        </div>
    );
}
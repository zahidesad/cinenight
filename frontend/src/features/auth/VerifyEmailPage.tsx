import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { verifyEmailChange } from "@/api/user";
import { useTranslation } from 'react-i18next';

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token');
    const { t } = useTranslation();

    const requestSent = useRef(false);

    const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('ERROR');
            setMsg(t('auth.pages.verify_email.invalid_link'));
            return;
        }

        if (requestSent.current) return;
        requestSent.current = true;

        const type = params.get('type');

        const verifyFn = type === 'email_change' ? verifyEmailChange : verifyEmail;

        verifyFn(token).then(res => {
            if (res.ok) {
                setStatus('SUCCESS');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus('ERROR');
                setMsg(res.error || t('auth.pages.verify_email.failed'));
            }
        });
    }, [token, navigate, params, t]);

    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
            {status === 'LOADING' && (
                <>
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                    <h2 className="text-xl font-semibold text-white">{t('auth.pages.verify_email.loading')}</h2>
                </>
            )}

            {status === 'SUCCESS' && (
                <>
                    <CheckCircle className="h-16 w-16 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-white">{t('auth.pages.verify_email.success_title')}</h2>
                    <p className="text-gray-300">{t('auth.pages.verify_email.success_desc')}</p>
                </>
            )}

            {status === 'ERROR' && (
                <>
                    <XCircle className="h-16 w-16 text-red-500" />
                    <h2 className="text-2xl font-bold text-white">{t('auth.pages.verify_email.error_title')}</h2>
                    <p className="text-gray-400">{msg}</p>
                    <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700">
                        {t('auth.pages.verify_email.login_button')}
                    </button>
                </>
            )}
        </div>
    );
}
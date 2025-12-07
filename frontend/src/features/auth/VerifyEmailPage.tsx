import { useEffect, useState, useRef } from 'react'; // useRef'i eklemeyi unutma
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token');

    const requestSent = useRef(false);

    const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('ERROR');
            setMsg('Geçersiz bağlantı.');
            return;
        }

        if (requestSent.current) return;
        requestSent.current = true;

        verifyEmail(token).then(res => {
            if (res.ok) {
                setStatus('SUCCESS');
                // 3 saniye sonra login'e at
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setStatus('ERROR');
                setMsg(res.error || 'Doğrulama başarısız.');
            }
        });
    }, [token, navigate]);

    // ... (return kısmı aynı kalacak)
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
            {status === 'LOADING' && (
                <>
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
                    <h2 className="text-xl font-semibold text-white">Hesabın doğrulanıyor...</h2>
                </>
            )}

            {status === 'SUCCESS' && (
                <>
                    <CheckCircle className="h-16 w-16 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-white">Başarılı!</h2>
                    <p className="text-gray-300">E-posta adresin doğrulandı. Giriş ekranına yönlendiriliyorsun...</p>
                </>
            )}

            {status === 'ERROR' && (
                <>
                    <XCircle className="h-16 w-16 text-red-500" />
                    <h2 className="text-2xl font-bold text-white">Hata</h2>
                    <p className="text-gray-400">{msg}</p>
                    <button onClick={() => navigate('/login')} className="px-6 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700">
                        Giriş Yap
                    </button>
                </>
            )}
        </div>
    );
}
import { useEffect, useState } from 'react';
import { apiGet } from '@/api/client';

export default function HealthStatus() {
    const [msg, setMsg] = useState('checking...');

    useEffect(() => {
        (async () => {
            const r = await apiGet<string>('/health/ping');
            if (r.ok && r.data != null) setMsg(`Backend OK: ${r.data}`);
            else setMsg(`Backend error: ${r.error ?? 'unknown'}`);
        })();
    }, []);

    return <div>{msg}</div>;
}

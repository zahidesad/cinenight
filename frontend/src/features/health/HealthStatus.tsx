import { useEffect, useState } from 'react';
import { apiGet } from '@/api/client';

export default function HealthStatus() {
    const [msg, setMsg] = useState('checking...');
    useEffect(() => {
        apiGet<string>('/health/ping').then((r) => {
            if (r.ok) setMsg(`Backend OK: ${r.data}`);
            else setMsg(`Backend error: ${r.error}`);
        });
    }, []);
    return <div>{msg}</div>;
}

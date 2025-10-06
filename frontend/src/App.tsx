import { useEffect, useState } from 'react'

export default function App() {
    const [status, setStatus] = useState('loading...')
    useEffect(() => {
        fetch('/api/health')
            .then(r => r.json())
            .then(d => setStatus(d.status ?? 'ok'))
            .catch(() => setStatus('error'))
    }, [])
    return <div style={{ padding: 20, fontFamily: 'sans-serif' }}>Backend status: {status}</div>
}

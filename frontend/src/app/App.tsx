import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom'
import '@/index.css'
import './auth.css'
import { useEffect, useState } from 'react'
import { login, register, forgot, resetPassword, me, logout, type UserDto } from '@/api/auth'
import HealthStatus from '@/features/health/HealthStatus'

function Shell() {
    const [user, setUser] = useState<UserDto | null>(null)
    const nav = useNavigate()

    useEffect(() => {
        me().then(r => r.ok && setUser(r.data ?? null))
    }, [])

    const doLogout = async () => {
        await logout()
        setUser(null)
        nav('/login')
    }

    return (
        <div className="auth-shell">
            <header className="auth-header">
                <Link to="/" className="brand">🎬 CineNight</Link>
                <nav>
                    {user ? (
                        <>
                            <span className="user-chip">{user.displayName ?? user.email}</span>
                            <button className="btn" onClick={doLogout}>Çıkış</button>
                        </>
                    ) : (
                        <>
                            <Link className="btn ghost" to="/login">Giriş</Link>
                            <Link className="btn" to="/register">Kayıt Ol</Link>
                        </>
                    )}
                </nav>
            </header>

            <main className="auth-main">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login onLogged={u => setUser(u)} />} />
                    <Route path="/register" element={<Register onRegistered={() => nav('/login')} />} />
                    <Route path="/forgot" element={<Forgot />} />
                    <Route path="/reset" element={<Reset />} />
                </Routes>
            </main>

            <footer className="auth-footer">
                <HealthStatus />
            </footer>
        </div>
    )
}

function Home() {
    return (
        <div className="card">
            <h1>Hoş geldin 👋</h1>
            <p>Film geceleri planlamak için giriş yap veya kayıt ol.</p>
            <div className="links">
                <Link className="btn" to="/login">Giriş</Link>
                <Link className="btn ghost" to="/register">Kayıt Ol</Link>
            </div>
        </div>
    )
}

function Login({ onLogged }: { onLogged: (u: UserDto) => void }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState<string | null>(null)
    const nav = useNavigate()

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const r = await login(email, password)
        if (r.ok && r.data) { onLogged(r.data); nav('/') }
        else setErr(r.error ?? 'Giriş başarısız')
    }

    return (
        <div className="card">
            <h2>Giriş Yap</h2>
            <form onSubmit={submit} className="form">
                <input placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {err && <div className="error">{err}</div>}
                <button className="btn" type="submit">Giriş</button>
            </form>
            <div className="muted">
                <Link to="/forgot">Şifremi unuttum</Link>
            </div>
        </div>
    )
}

function Register({ onRegistered }: { onRegistered: () => void }) {
    const [displayName, setDisplayName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const r = await register(email, password, displayName)
        if (r.ok) onRegistered()
        else setErr(r.error ?? 'Kayıt başarısız')
    }

    return (
        <div className="card">
            <h2>Kayıt Ol</h2>
            <form onSubmit={submit} className="form">
                <input placeholder="Görünen ad" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                <input placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} />
                <input placeholder="Şifre" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                {err && <div className="error">{err}</div>}
                <button className="btn" type="submit">Kayıt Ol</button>
            </form>
            <div className="muted">
                Zaten hesabın var mı? <Link to="/login">Giriş yap</Link>
            </div>
        </div>
    )
}

function Forgot() {
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const r = await forgot(email)
        if (r.ok) { setMsg('E-posta gönderildi (geliştirme modunda).'); setErr(null) }
        else { setErr(r.error ?? 'İşlem başarısız'); setMsg(null) }
    }

    return (
        <div className="card">
            <h2>Şifremi Unuttum</h2>
            <form onSubmit={submit} className="form">
                <input placeholder="E-posta" value={email} onChange={e => setEmail(e.target.value)} />
                {err && <div className="error">{err}</div>}
                {msg && <div className="success">{msg}</div>}
                <button className="btn" type="submit">Gönder</button>
            </form>
            <div className="muted">
                Reset linki geldikten sonra <code>/reset?token=...</code> sayfasına gidebilirsin.
            </div>
        </div>
    )
}

function Reset() {
    const params = new URLSearchParams(location.search)
    const [token, setToken] = useState(params.get('token') ?? '')
    const [pw, setPw] = useState('')
    const [msg, setMsg] = useState<string | null>(null)
    const [err, setErr] = useState<string | null>(null)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const r = await resetPassword(token, pw)
        if (r.ok) { setMsg('Şifren güncellendi.'); setErr(null) }
        else { setErr(r.error ?? 'İşlem başarısız'); setMsg(null) }
    }

    return (
        <div className="card">
            <h2>Şifre Sıfırla</h2>
            <form onSubmit={submit} className="form">
                <input placeholder="Token" value={token} onChange={e => setToken(e.target.value)} />
                <input placeholder="Yeni şifre" type="password" value={pw} onChange={e => setPw(e.target.value)} />
                {err && <div className="error">{err}</div>}
                {msg && <div className="success">{msg}</div>}
                <button className="btn" type="submit">Güncelle</button>
            </form>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    )
}

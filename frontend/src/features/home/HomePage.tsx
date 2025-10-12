import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="home-card">
            <h1>Hoş geldin 👋</h1>
            <p>Film geceleri planlamak için giriş yap veya kayıt ol.</p>
            <div className="links">
                <Link className="btn" to="/login">Giriş</Link>
                <Link className="btn ghost" to="/register">Kayıt Ol</Link>
            </div>
        </div>
    );
}
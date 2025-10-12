import { Link, Outlet } from 'react-router-dom';
import { UserDto } from '@/api/auth';
import { logout } from '@/api/auth';

interface RootLayoutProps {
    user: UserDto | null;
    onLogout: () => void;
}

export default function RootLayout({ user, onLogout }: RootLayoutProps) {
    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    return (
        <div className="main-shell">
            <header className="main-header">
                <Link to="/" className="brand">🎬 CineNight</Link>
                <nav>
                    {user ? (
                        <>
                            <span className="user-chip">{user.displayName ?? user.email}</span>
                            <button className="btn" onClick={handleLogout}>Çıkış</button>
                        </>
                    ) : (
                        <>
                            <Link className="btn ghost" to="/login">Giriş</Link>
                            <Link className="btn" to="/register">Kayıt Ol</Link>
                        </>
                    )}
                </nav>
            </header>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
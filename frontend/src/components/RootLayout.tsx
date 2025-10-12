import { Link, Outlet } from 'react-router-dom';
import { UserDto, logout } from '@/api/auth';

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
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-gray-900/80 backdrop-blur">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="text-xl font-bold text-indigo-400">
                        🎬 CineNight
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-300">Hoş geldin, {user.displayName ?? user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-md px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-700"
                                >
                                    Giriş
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}
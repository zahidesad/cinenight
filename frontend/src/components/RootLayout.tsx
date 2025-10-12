import { Link, Outlet, useLocation } from 'react-router-dom';
import { UserDto, logout } from '@/api/auth';

interface RootLayoutProps {
    user: UserDto | null;
    onLogout: () => void;
}

export default function RootLayout({ user, onLogout }: RootLayoutProps) {
    const { pathname } = useLocation();

    const handleLogout = async () => {
        await logout();
        onLogout();
    };

    const isHome = pathname === '/';

    return (
        <div className="min-h-screen bg-gray-950 text-gray-200">
            <header className="sticky top-0 z-20 border-b border-white/10 bg-gray-950/70 backdrop-blur">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="text-xl font-bold text-indigo-400">🎬 CineNight</Link>

                    <div className="hidden items-center gap-6 md:flex">
                        <a href="/#features" className="text-sm text-gray-300 hover:text-white transition">Özellikler</a>
                        <a href="/#flow" className="text-sm text-gray-300 hover:text-white transition">Nasıl Çalışır</a>
                        <Link to="/try" className="text-sm text-gray-300 hover:text-white transition">Canlı Demo</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span className="hidden text-sm text-gray-300 sm:block">
                                    Hoş geldin, {user.displayName ?? user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
                                >
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-md px-4 py-2 text-sm font-semibold text-gray-300 transition hover:bg-gray-800"
                                >
                                    Giriş
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Kayıt Ol
                                </Link>
                                <Link
                                    to="/try"
                                    className="hidden rounded-md bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-700 md:block"
                                >
                                    Hemen Dene
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
                {isHome && (
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                )}
            </header>

            <main className="container mx-auto p-4 md:p-8">
                <Outlet />
            </main>

            <footer className="border-t border-white/10 py-8 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} CineNight · Film Gecesi Planlayıcı
            </footer>
        </div>
    );
}

import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gray-800 p-10 text-center shadow-lg">
            <h1 className="text-4xl font-bold text-white">Hoş geldin 👋</h1>
            <p className="mt-4 max-w-md text-lg text-gray-400">
                Arkadaşlarınla birlikte film geceleri planlamak ve en iyi filmleri seçmek için hemen başla.
            </p>
            <div className="mt-8 flex gap-4">
                <Link
                    to="/login"
                    className="rounded-md bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Giriş Yap
                </Link>
                <Link
                    to="/register"
                    className="rounded-md bg-gray-700 px-5 py-3 text-base font-semibold text-white transition hover:bg-gray-600"
                >
                    Kayıt Ol
                </Link>
            </div>
        </div>
    );
}
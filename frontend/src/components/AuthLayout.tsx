import { Outlet } from 'react-router-dom';
import FilmReelIcon from '@/assets/film-reel.svg?react';

export default function AuthLayout() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-gray-800 p-8 shadow-2xl">
                <div className="text-center">
                    <FilmReelIcon className="mx-auto h-12 w-auto text-indigo-400" />
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                        CineNight
                    </h1>
                </div>
                <Outlet />
            </div>
        </div>
    );
}
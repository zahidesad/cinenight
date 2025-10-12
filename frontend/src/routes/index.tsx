import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { me, type UserDto } from '@/api/auth';
import RootLayout from '@/components/RootLayout';
import AuthLayout from '@/components/AuthLayout';
import HomePage from '@/features/home/HomePage';
import LoginPage from '@/features/auth/LoginPage';
import RegisterPage from '@/features/auth/RegisterPage';
import ForgotPasswordPage from '@/features/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/ResetPasswordPage';

export default function AppRoutes() {
    const [user, setUser] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        me().then(r => {
            if (r.ok && r.data) {
                setUser(r.data);
            }
            setLoading(false);
        });
    }, []);

    const handleLogin = (user: UserDto) => {
        setUser(user);
        navigate('/');
    };

    const handleLogout = () => {
        setUser(null);
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

    return (
        <Routes>
            <Route element={<RootLayout user={user} onLogout={handleLogout} />}>
                <Route path="/" element={<HomePage />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage onLoginSuccess={handleLogin} />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
        </Routes>
    );
}
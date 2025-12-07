import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { UserDto } from '@/api/auth';

type Props = {
    user: UserDto | null;
};

export default function ProtectedRoute({ user }: Props) {
    const location = useLocation();

    if (!user) {
        return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
    }

    return <Outlet />;
}
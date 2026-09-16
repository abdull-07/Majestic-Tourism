import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

type Props = {
    allowedRoles: Array<'CUSTOMER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN'>;
    redirectTo?: string;
};

export default function ProtectedRoute({ allowedRoles, redirectTo = '/admin/login' }: Props) {
    const user = useAuthStore((s) => s.user);

    if (!user) return <Navigate to={redirectTo} replace />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return <Outlet />;
}
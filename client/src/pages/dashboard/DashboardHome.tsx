import { useAuthStore } from '../../store/useAuthStore';

export default function DashboardHome() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="wrapper py-32">
            <h1 className="text-headline-md text-primary">Welcome, {user?.fullName || user?.email}</h1>
            <p className="text-text-muted mt-2">Dashboard coming soon.</p>
        </div>
    );
}
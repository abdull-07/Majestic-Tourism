import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminTopbar() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <header className="h-16 bg-white border-b border-mountain-mist flex items-center justify-between px-6">
            <div className="relative w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border border-mountain-mist rounded-lg pl-9 pr-3 py-2 text-body-sm focus:outline-none focus:border-secondary"
                />
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-body-sm font-medium text-on-surface">{user?.fullName || user?.email}</p>
                    <p className="text-body-sm text-text-muted capitalize">{user?.role?.toLowerCase().replace('_', ' ')}</p>
                </div>
                <button onClick={handleLogout} className="w-9 h-9 rounded-full bg-surface-container-high text-text-muted hover:bg-error-container hover:text-error flex items-center justify-center transition-colors">
                    <LogOut size={16} />
                </button>
            </div>
        </header>
    );
}
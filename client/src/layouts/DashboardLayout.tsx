import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, User, Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
    { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/dashboard/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/dashboard/profile', label: 'Profile', icon: User },
    // Payments, Reviews, Profile get added as each page is built
];

export default function DashboardLayout() {
    const user = useAuthStore((s) => s.user);

    return (
        <div className="wrapper pt-28 pb-16">
            <div className="mb-8">
                <span className="label text-secondary">My Account</span>
                <h1 className="text-headline-md text-primary mt-1">
                    Hello, {user?.fullName?.split(' ')[0] || 'there'}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
                <aside className="md:col-span-1">
                    <nav className="card p-3 flex md:flex-col gap-1 overflow-x-auto">
                        {navItems.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-body-sm font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'
                                    }`
                                }
                            >
                                <Icon size={18} />
                                {label}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                <section className="md:col-span-3 min-w-0">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}

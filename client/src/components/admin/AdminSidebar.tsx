import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, MapPin, Compass, CalendarCheck, CreditCard,
    Star, Newspaper, Users, Tag, Settings,
} from 'lucide-react';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { to: '/admin/tours', label: 'Tours', icon: Compass },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/reviews', label: 'Reviews', icon: Star },
    { to: '/admin/blog', label: 'Blog', icon: Newspaper },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
    return (
        <aside className="w-64 shrink-0 bg-primary text-white min-h-screen flex flex-col">
            <div className="px-6 py-5 border-b border-white/10">
                <h1 className="text-headline-sm font-bold">Majestic Tourism</h1>
                <p className="text-white/60 text-body-sm">Admin Panel</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm font-medium transition-colors ${isActive ? 'bg-primary-container text-white' : 'text-white/70 hover:bg-white/10'
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
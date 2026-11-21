import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ChevronDown, Monitor} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const navLinks = [
    { label: 'Destinations', to: '/destinations' },
    { label: 'Tours', to: '/tours' },
    { label: 'Expeditions', to: '/expeditions' },
    { label: 'Maps', to: '/maps' },
];

const guestLinks = [
    { label: 'About', to: '/about' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Tours', to: '/tours' },
    { label: 'Expeditions', to: '/expeditions' },
    { label: 'Stays', to: '/stays' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuthStore();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
    }, [location.pathname]);

    const links = user ? navLinks : guestLinks;
    const initials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.[0]?.toUpperCase() || 'U';

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-xl shadow-sm py-0'
                : 'bg-white/70 backdrop-blur-xl py-0'
                } border-b border-glass-stroke`}
        >
            <div className="wrapper flex justify-between items-center h-[72px]">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                    <span className="text-headline-sm font-bold text-primary tracking-tight font-heading">
                        PeakLuxury
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {links.map((link) => {
                        const isActive = location.pathname === link.to ||
                            location.pathname.startsWith(link.to + '/');
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-full text-body-md font-medium transition-all duration-200 ${isActive
                                    ? 'text-primary bg-primary/5 font-semibold'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {user ? (
                        /* ── Logged-in: Avatar dropdown ── */
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 group"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow">
                                    {initials}
                                </div>
                                <ChevronDown
                                    size={14}
                                    className={`text-on-surface-variant transition-transform duration-200 hidden md:block ${profileOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setProfileOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-semibold text-slate-900 truncate">
                                                {user.fullName || 'User'}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            to="/dashboard/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <User size={16} />
                                            My Profile
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Monitor size={16} />
                                            Dashbord
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setProfileOpen(false);
                                            }}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        /* ── Guest: Login / Sign Up ── */
                        <>
                            <Link
                                to="/login"
                                className="hidden md:inline-flex text-on-surface-variant hover:text-primary font-semibold text-body-md transition-colors"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all active:scale-95 text-body-md"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden p-2 -mr-2 text-on-surface-variant"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                    <div className="wrapper py-4 flex flex-col gap-1">
                        {links.map((link) => {
                            const isActive = location.pathname === link.to ||
                                location.pathname.startsWith(link.to + '/');
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-3 rounded-lg text-body-md font-medium transition-colors ${isActive
                                        ? 'text-primary bg-primary/5 font-semibold'
                                        : 'text-on-surface-variant hover:text-primary hover:bg-slate-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                        {!user && (
                            <div className="pt-3 mt-2 border-t border-slate-100 flex flex-col gap-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-3 rounded-lg text-body-md font-medium text-on-surface-variant hover:text-primary hover:bg-slate-50 transition-colors"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-primary text-white px-4 py-3 rounded-lg font-semibold text-center text-body-md"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                        {user && (
                            <div className="pt-3 mt-2 border-t border-slate-100">
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
    { label: 'About', to: '/about' },
    { label: 'Destinations', to: '/destinations' },
    { label: 'Tours', to: '/tours' },
    { label: 'Expeditions', to: '/expeditions' },
    { label: 'Stays', to: '/stays' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b border-glass-stroke shadow-sm transition-all duration-300 ${scrolled ? 'bg-white/90 py-4' : 'bg-white/70 h-20'
                }`}
        >
            <div className="wrapper flex justify-between items-center h-20">
                <Link to="/" className="text-headline-sm font-bold text-primary">
                    Majestic Tourism
                </Link>

                <div className="hidden md:flex space-x-8 items-center">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={
                                i === 0
                                    ? 'text-primary font-semibold border-b-2 border-primary text-body-md'
                                    : 'text-on-surface-variant hover:text-primary transition-all duration-300 text-body-md'
                            }
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-on-surface-variant hover:text-primary font-semibold text-body-md transition-colors">
                        Log In
                    </Link>
                    <Link to="/register" className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-all active:scale-95">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
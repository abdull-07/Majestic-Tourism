import { Globe, Mail, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-700 text-xs">
            <div className="max-w-[1280px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-slate-100">
                    {/* Brand Column */}
                    <div className="space-y-4">
                        <Link to="/" className="text-xl font-bold font-serif text-slate-900 tracking-tight block">
                            PeakLuxury
                        </Link>
                        <p className="text-slate-500 leading-relaxed max-w-xs">
                            Elevating mountain travel in Pakistan to a level of unparalleled luxury and soulful discovery.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <a
                                href="#"
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:info@peakluxury.pk"
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Explore Column */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-[11px]">
                            Explore
                        </h4>
                        <ul className="space-y-2.5 text-slate-600">
                            <li><Link to="/about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
                            <li><a href="#" className="hover:text-slate-900 transition-colors">Sustainability</a></li>
                            <li><a href="#" className="hover:text-slate-900 transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-[11px]">
                            Legal
                        </h4>
                        <ul className="space-y-2.5 text-slate-600">
                            <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-[11px]">
                            Newsletter
                        </h4>
                        <p className="text-slate-500 mb-4">
                            Join our elite circle for secret destinations.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none w-full"
                            />
                            <button
                                type="submit"
                                className="bg-slate-900 text-white p-2 rounded-md hover:bg-slate-800 transition-colors shrink-0"
                            >
                                <Send className="w-3.5 h-3.5" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Credits */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 gap-4 text-[11px]">
                    <p>© {new Date().getFullYear()} PeakLuxury Pakistan. All rights reserved.</p>
                    <p className="font-serif italic text-slate-500">Designed for the Adventurous</p>
                </div>
            </div>
        </footer>
    );
}
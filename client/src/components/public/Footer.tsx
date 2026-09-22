import { Globe, Mail, Phone } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-surface-container-lowest py-16 border-t border-mountain-mist">
            <div className="wrapper grid grid-cols-1 md:grid-cols-4 gap-gutter">
                <div>
                    <div className="text-headline-sm font-bold text-primary mb-6">Majestic Tourism</div>
                    <p className="text-text-muted text-body-sm leading-relaxed mb-6">
                        Redefining luxury travel in the Karakoram, Himalaya, and Hindukush ranges.
                        Pakistan's premier expedition partner.
                    </p>
                    <div className="flex gap-4">
                        {[Globe, Mail, Phone].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 rounded-full border border-mountain-mist flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-primary mb-6">Company</h4>
                    <ul className="space-y-4">
                        {['About Us', 'Sustainability', 'Careers'].map((item) => (
                            <li key={item}><a href="#" className="text-text-muted hover:text-primary transition-transform duration-200 hover:translate-x-1 inline-block">{item}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-primary mb-6">Destinations</h4>
                    <ul className="space-y-4">
                        {['Hunza Valley', 'Skardu Valley', 'Swat & Kalam'].map((item) => (
                            <li key={item}><a href="#" className="text-text-muted hover:text-primary transition-transform duration-200 hover:translate-x-1 inline-block">{item}</a></li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-primary mb-6">Support</h4>
                    <ul className="space-y-4">
                        {['Contact Us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                            <li key={item}><a href="#" className="text-text-muted hover:text-primary transition-transform duration-200 hover:translate-x-1 inline-block">{item}</a></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="wrapper mt-16 pt-8 border-t border-mountain-mist text-center">
                <p className="text-text-muted text-body-sm">© {new Date().getFullYear()} Majestic Tourism. All rights reserved.</p>
            </div>
        </footer>
    );
}
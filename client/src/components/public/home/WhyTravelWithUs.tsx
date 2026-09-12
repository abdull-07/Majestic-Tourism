import { motion } from 'motion/react';
import { Compass, Home as HomeIcon, ShieldCheck } from 'lucide-react';

const points = [
    { icon: Compass, iconBg: 'bg-primary-fixed', iconColor: 'text-primary', title: 'Expert Guides', desc: 'Local specialists with decades of high-altitude experience ensuring your safety and cultural immersion.' },
    { icon: HomeIcon, iconBg: 'bg-secondary-fixed', iconColor: 'text-secondary', title: 'Premium Stays', desc: 'Hand-picked luxury eco-resorts and private glamping sites at the edge of the wilderness.' },
    { icon: ShieldCheck, iconBg: 'bg-error-container', iconColor: 'text-error', title: 'Safety First', desc: 'Full logistical support including helicopter rescue standby and professional medical equipment.' },
];

export default function WhyTravelWithUs() {
    return (
        <section className="bg-surface-container-low py-24">
            <div className="wrapper">
                <div className="text-center mb-16">
                    <span className="label text-secondary">Our Standards</span>
                    <h2 className="text-headline-md text-primary mt-2">Why Travel With Majestic Tourism?</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {points.map(({ icon: Icon, iconBg, iconColor, title, desc }, i) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: i * 0.15 }}
                            className="card p-10 hover:shadow-md transition-shadow duration-300 group"
                        >
                            <div className={`w-16 h-16 ${iconBg} rounded-xl flex items-center justify-center ${iconColor} mb-6 group-hover:scale-110 transition-transform`}>
                                <Icon size={32} />
                            </div>
                            <h4 className="text-headline-sm mb-4">{title}</h4>
                            <p className="text-text-muted">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
import { motion } from 'motion/react';
import { Handshake, Leaf, MapPin } from 'lucide-react';

const values = [
    { icon: Handshake, title: 'Local First', desc: 'Every guide, driver, and guesthouse we work with is a local partner, not a franchise — your trip directly supports the communities you pass through.' },
    { icon: Leaf, title: 'Leave No Trace', desc: 'Small group sizes, waste-carry-out policies, and route planning that respects fragile high-altitude ecosystems.' },
    { icon: MapPin, title: 'Real Local Knowledge', desc: 'Our itineraries are shaped by decades of on-the-ground experience, not a template applied to every valley.' },
];

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function OurValues() {
    return (
        <section className="bg-surface-container-low py-24">
            <div className="wrapper">
                <div className="text-center mb-16">
                    <span className="label text-secondary">What We Stand For</span>
                    <h2 className="text-headline-md text-primary mt-2">Our Values</h2>
                </div>
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-12"
                >
                    {values.map(({ icon: Icon, title, desc }) => (
                        <motion.div key={title} variants={cardVariants} className="card p-10 text-center">
                            <div className="w-16 h-16 mx-auto bg-primary-fixed rounded-xl flex items-center justify-center text-primary mb-6">
                                <Icon size={32} />
                            </div>
                            <h4 className="text-headline-sm mb-4">{title}</h4>
                            <p className="text-text-muted">{desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
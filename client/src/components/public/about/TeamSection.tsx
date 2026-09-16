import { motion } from 'motion/react';

const team = [
    { name: 'Imran Baig', role: 'Founder & Lead Guide', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400' },
    { name: 'Sana Karim', role: 'Head of Operations', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400' },
    { name: 'Ali Hunzai', role: 'Senior Trek Leader', img: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=400' },
    { name: 'Fatima Noor', role: 'Guest Experience Lead', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400' },
];

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function TeamSection() {
    return (
        <section className="wrapper py-24">
            <div className="text-center mb-16">
                <span className="label text-secondary">Meet the Team</span>
                <h2 className="text-headline-md text-primary mt-2">The People Behind Your Trip</h2>
            </div>
            <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-gutter"
            >
                {team.map((member) => (
                    <motion.div key={member.name} variants={cardVariants} className="text-center">
                        <div className="w-full aspect-square rounded-xl overflow-hidden mb-4">
                            <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-primary">{member.name}</h4>
                        <p className="text-text-muted text-body-sm">{member.role}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
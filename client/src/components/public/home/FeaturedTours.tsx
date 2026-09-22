import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Users } from 'lucide-react';

const categories = ['All', 'Luxury', 'Adventure'];

const tours = [
    { title: 'K2 Base Camp Expedition', price: '$2,450', duration: '14 Days', group: 'Max 10', category: 'Adventure', badge: 'Adventure', badgeBg: 'bg-primary', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000' },
    { title: 'Hunza Valley Retreat', price: '$1,200', duration: '7 Days', group: 'Couples', category: 'Luxury', badge: 'Luxury Stays', badgeBg: 'bg-tertiary-container', img: 'https://images.unsplash.com/photo-1591825381179-6f2f4c1e1c0e?q=80&w=1000' },
    { title: 'Hidden Skardu Gems', price: '$1,850', duration: '10 Days', group: 'Families', category: 'Adventure', badge: 'Cultural', badgeBg: 'bg-secondary', img: 'https://images.unsplash.com/photo-1580500550469-4a30e3f8ba7e?q=80&w=1000' },
];

export default function FeaturedTours() {
    const [filter, setFilter] = useState('All');
    const filtered = filter === 'All' ? tours : tours.filter((t) => t.category === filter);

    return (
        <section className="wrapper py-24">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <h2 className="text-headline-md text-primary">Featured Tour Packages</h2>
                <div className="flex gap-4 mt-6 md:mt-0">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full label transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                {filtered.map((tour, i) => (
                    <motion.div
                        key={tour.title}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: i * 0.15 }}
                        className="card overflow-hidden hover:shadow-lg transition-shadow duration-500 group"
                    >
                        <div className="relative h-64 overflow-hidden">
                            <img src={tour.img} alt={tour.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className={`absolute top-4 left-4 ${tour.badgeBg} text-white label px-3 py-1 rounded-full`}>{tour.badge}</div>
                        </div>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-primary">{tour.title}</h3>
                                <span className="text-secondary font-bold text-lg">{tour.price}</span>
                            </div>
                            <div className="flex items-center gap-4 text-text-muted text-body-sm mb-6">
                                <div className="flex items-center gap-1"><Clock size={16} /> {tour.duration}</div>
                                <div className="flex items-center gap-1"><Users size={16} /> {tour.group}</div>
                            </div>
                            <button className="w-full border-2 border-primary text-primary py-3 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors duration-300">
                                View Itinerary
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
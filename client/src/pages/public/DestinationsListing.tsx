import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { destinationsApi } from '../../lib/api/destinations';
import DestinationCard from '../../components/public/destinations/DestinationCard';
import type { Destination } from '../../types/destination';

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function DestinationsListing() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        destinationsApi
            .getAllActive()
            .then(setDestinations)
            .catch(() => setError('Could not load destinations right now — please try again shortly.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <section className="relative h-[50vh] min-h-[360px] w-full flex items-center justify-center overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2000"
                    alt="Northern Pakistan mountains"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 text-center px-6">
                    <span className="label text-white/80">Explore</span>
                    <h1 className="text-display-lg-mobile md:text-display-lg text-white mt-2">Destinations</h1>
                </div>
            </section>

            <section className="wrapper py-24">
                {loading && (
                    <p className="text-center text-text-muted">Loading destinations...</p>
                )}

                {error && (
                    <p className="text-center text-error">{error}</p>
                )}

                {!loading && !error && destinations.length === 0 && (
                    <p className="text-center text-text-muted">
                        No destinations are available yet — check back soon.
                    </p>
                )}

                {!loading && !error && destinations.length > 0 && (
                    <motion.div
                        variants={gridVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
                    >
                        {destinations.map((d) => (
                            <DestinationCard key={d.id} destination={d} />
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
}
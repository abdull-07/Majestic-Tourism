import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, Calendar } from 'lucide-react';
import { destinationsApi } from '../../lib/api/destinations';
import type { DestinationDetail as DestinationDetailType } from '../../types/destination';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1600';
const TOUR_FALLBACK_IMG = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800';

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function DestinationDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [destination, setDestination] = useState<DestinationDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        destinationsApi
            .getBySlug(slug)
            .then(setDestination)
            .catch(() => setError('This destination could not be found.'))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="wrapper py-24 text-center text-text-muted">Loading destination...</div>;
    if (error || !destination) return <div className="wrapper py-24 text-center text-error">{error || 'Destination not found.'}</div>;

    return (
        <div>
            <section className="relative h-[55vh] min-h-[400px] w-full flex items-end overflow-hidden">
                <img src={destination.coverImage || FALLBACK_IMG} alt={destination.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10 wrapper pb-12 text-white">
                    <h1 className="text-display-lg-mobile md:text-display-lg">{destination.name}</h1>
                    {destination.bestTimeToVisit && (
                        <p className="flex items-center gap-2 mt-3 text-body-md opacity-90">
                            <Calendar size={16} /> Best time to visit: {destination.bestTimeToVisit}
                        </p>
                    )}
                </div>
            </section>

            <section className="wrapper py-16">
                <p className="text-text-muted text-body-lg max-w-3xl mb-16">{destination.description}</p>

                <h2 className="text-headline-md text-primary mb-8">Tours in {destination.name}</h2>

                {destination.tours.length === 0 ? (
                    <p className="text-text-muted">No tours are currently listed for this destination.</p>
                ) : (
                    <motion.div
                        variants={gridVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
                    >
                        {destination.tours.map((tour) => (
                            <motion.div key={tour.id} variants={cardVariants}>
                                <Link to={`/tours/${tour.slug}`} className="card overflow-hidden block group h-full">
                                    <div className="h-48 overflow-hidden">
                                        <img src={TOUR_FALLBACK_IMG} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-primary mb-2">{tour.title}</h3>
                                        <div className="flex items-center justify-between text-body-sm text-text-muted">
                                            <span className="flex items-center gap-1"><Clock size={14} /> {tour.durationDays} Days</span>
                                            <span className="text-secondary font-bold">${Number(tour.basePrice).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>
        </div>
    );
}
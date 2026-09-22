import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Clock, MapPin } from 'lucide-react';
import type { Tour } from '../../../types/tour';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800';
const CATEGORY_LABELS: Record<string, string> = {
    FAMILY: 'Family', HONEYMOON: 'Honeymoon', GROUP: 'Group',
    ADVENTURE: 'Adventure', BUDGET: 'Budget', LUXURY: 'Luxury',
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function TourCard({ tour }: { tour: Tour }) {
    const cover = tour.images?.find((i) => i.isCover)?.url || tour.images?.[0]?.url || FALLBACK_IMG;

    return (
        <motion.div variants={cardVariants}>
            <Link to={`/tours/${tour.slug}`} className="card overflow-hidden block group h-full">
                <div className="relative h-56 overflow-hidden">
                    <img src={cover} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-4 left-4 bg-primary text-white label px-3 py-1 rounded-full">
                        {CATEGORY_LABELS[tour.category] || tour.category}
                    </span>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-1 text-text-muted text-body-sm mb-2">
                        <MapPin size={14} /> {tour.destination.name}
                    </div>
                    <h3 className="text-headline-sm text-primary mb-3">{tour.title}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-text-muted text-body-sm">
                            <Clock size={14} /> {tour.durationDays}D / {tour.durationNights}N
                        </div>
                        <span className="text-secondary font-bold text-lg">${Number(tour.basePrice).toLocaleString()}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
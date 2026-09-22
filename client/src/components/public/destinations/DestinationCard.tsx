import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import type { Destination } from '../../../types/destination';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <motion.div variants={cardVariants}>
      <Link to={`/destinations/${destination.slug}`} className="card overflow-hidden block group h-full">
        <div className="h-56 overflow-hidden">
          <img
            src={destination.coverImage || FALLBACK_IMG}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="p-6">
          <h3 className="text-headline-sm text-primary mb-2">{destination.name}</h3>
          <p className="text-text-muted text-body-sm line-clamp-2 mb-4">{destination.description}</p>
          <div className="flex items-center justify-between text-body-sm">
            {destination.bestTimeToVisit && (
              <span className="text-text-muted">Best: {destination.bestTimeToVisit}</span>
            )}
            <span className="text-secondary font-semibold">
              {destination._count?.tours ?? 0} tour{destination._count?.tours === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
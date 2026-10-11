import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import type { Destination } from '../../../types/destination';

export interface ExtendedDestination extends Destination {
  locationTag?: string;
  badge?: string;
}

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function DestinationCard({ destination }: { destination: ExtendedDestination }) {
  const imageSrc = destination.coverImage || FALLBACK_IMG;
  const locationText = destination.locationTag || destination.bestTimeToVisit || 'Pakistan';
  const tagBadge = destination.badge || (destination._count?.tours !== undefined ? `${destination._count.tours} TOURS` : 'EXPLORE');

  return (
    <motion.div variants={cardVariants} className="h-full">
      <Link
        to={`/destinations/${destination.slug}`}
        className="group block h-full flex flex-col focus:outline-none"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm group-hover:shadow-md transition-all duration-500">
          <img
            src={imageSrc}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Top-Right Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block bg-white/85 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/60 shadow-sm">
              {tagBadge}
            </span>
          </div>

          {/* Subtle bottom gradient on image */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content Below Image */}
        <div className="pt-3.5 pb-2 px-1 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors duration-200 tracking-tight">
              {destination.name}
            </h3>

            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
          </div>

          <div className="mt-3 pt-2 flex items-center text-xs font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
            <span>Explore Packages</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
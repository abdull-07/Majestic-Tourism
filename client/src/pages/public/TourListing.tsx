import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toursApi } from '../../lib/api/tours';
import { destinationsApi } from '../../lib/api/destinations';
import TourCard from '../../components/public/tours/TourCard';
import TourFilters from '../../components/public/tours/TourFilters';
import type { Tour } from '../../types/tour';
import type { Destination } from '../../types/destination';

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function TourListing() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    destinationsApi.getAllActive().then(setDestinations).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    toursApi
      .getAllActive({
        destinationId: selectedDestination || undefined,
        category: selectedCategory || undefined,
      })
      .then(setTours)
      .catch(() => setError('Could not load tours right now — please try again shortly.'))
      .finally(() => setLoading(false));
  }, [selectedDestination, selectedCategory]);

  return (
    <div>
      <section className="relative h-[50vh] min-h-[360px] w-full flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2000"
          alt="Mountain expedition"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center px-6">
          <span className="label text-white/80">Curated Journeys</span>
          <h1 className="text-display-lg-mobile md:text-display-lg text-white mt-2">Tour Packages</h1>
        </div>
      </section>

      <section className="wrapper py-24">
        <TourFilters
          destinations={destinations}
          selectedDestination={selectedDestination}
          selectedCategory={selectedCategory}
          onDestinationChange={setSelectedDestination}
          onCategoryChange={setSelectedCategory}
        />

        {loading && <p className="text-center text-text-muted">Loading tours...</p>}
        {error && <p className="text-center text-error">{error}</p>}

        {!loading && !error && tours.length === 0 && (
          <p className="text-center text-text-muted">No tours match these filters yet.</p>
        )}

        {!loading && !error && tours.length > 0 && (
          <motion.div
            key={`${selectedDestination}-${selectedCategory}`}
            variants={gridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
          >
            {tours.map((t) => <TourCard key={t.id} tour={t} />)}
          </motion.div>
        )}
      </section>
    </div>
  );
}
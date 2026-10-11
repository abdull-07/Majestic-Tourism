import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { toursApi } from '../../lib/api/tours';
import TourCard from '../../components/public/tours/TourCard';
import TourFilters from '../../components/public/tours/TourFilters';
import type { FilterState } from '../../components/public/tours/TourFilters';
import type { Tour } from '../../types/tour';
import { X, ChevronDown } from 'lucide-react';

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function TourListing() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState<FilterState>({
        priceMax: 2000000,
        durations: [],
        difficulties: []
    });

    useEffect(() => {
        setLoading(true);
        setError('');
        toursApi
            .getAllActive({})
            .then(setTours)
            .catch(() => {
                // Fallback to mock data if backend is not running
                setTours([
                    {
                        id: '1', title: 'K2 Base Camp Trek', slug: 'k2-base-camp', description: 'Journey to the base of the world\'s second-highest mountain. A majestic expedition through the heart of...', category: 'ADVENTURE', durationDays: 12, durationNights: 11, basePrice: 700000, maxGroupSize: 12, destination: { name: 'Skardu', slug: 'skardu' }, images: [{ url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800', isCover: true }], difficultyLevel: 'Extreme'
                    } as any,
                    {
                        id: '2', title: 'Fairy Meadows Retreat', slug: 'fairy-meadows', description: 'Experience the legendary Fairy Meadows at the foot of Nanga Parbat. Luxury log cabins and panoramic...', category: 'FAMILY', durationDays: 8, durationNights: 7, basePrice: 518000, maxGroupSize: 10, destination: { name: 'Chilas', slug: 'chilas' }, images: [{ url: 'https://images.unsplash.com/photo-1546708973-23a31c50e415?q=80&w=800', isCover: true }], difficultyLevel: 'Moderate'
                    } as any,
                    {
                        id: '3', title: 'Snow Leopard Trail', slug: 'snow-leopard', description: 'An exclusive winter expedition into the Khunjerab National Park to track the elusive Ghost of the...', category: 'ADVENTURE', durationDays: 15, durationNights: 14, basePrice: 1176000, maxGroupSize: 6, destination: { name: 'Hunza', slug: 'hunza' }, images: [{ url: 'https://images.unsplash.com/photo-1513689452815-3e0e75a6be7d?q=80&w=800', isCover: true }], difficultyLevel: 'Challenging'
                    } as any,
                    {
                        id: '4', title: 'Hunza Cultural Safari', slug: 'hunza-safari', description: 'A luxurious immersion into the history and hospitality of the Hunza people. Visit ancient forts and orchards.', category: 'FAMILY', durationDays: 7, durationNights: 6, basePrice: 336000, maxGroupSize: 15, destination: { name: 'Hunza', slug: 'hunza' }, images: [{ url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800', isCover: true }], difficultyLevel: 'Easy'
                    } as any
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredTours = tours.filter((tour) => {
        if (tour.basePrice > filters.priceMax) return false;
        
        if (filters.durations.length > 0) {
            const matchesDuration = filters.durations.some((range) => {
                const [min, max] = range.split('-').map(Number);
                return tour.durationDays >= min && tour.durationDays <= max;
            });
            if (!matchesDuration) return false;
        }

        if (filters.difficulties.length > 0) {
            const diff = (tour as any).difficultyLevel;
            if (diff && !filters.difficulties.includes(diff)) return false;
        }

        return true;
    });

    return (
        <div className="bg-[#f7f9fb] min-h-screen pb-24 pt-32">
            <div className="wrapper">
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#0a231b] font-heading mb-4">
                        Unforgettable Expeditions
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl">
                        Discover the world's most breathtaking peaks and hidden valleys with our
                        curated luxury tour packages in Northern Pakistan.
                    </p>
                </div>

                {/* Main Content: 2 Column Layout */}
                <div className="flex flex-col lg:flex-row gap-8 relative">
                    {/* Sidebar */}
                    <div className="w-full lg:w-[280px] shrink-0">
                        <TourFilters filters={filters} onChange={setFilters} />
                    </div>

                    {/* Tours Grid */}
                    <div className="flex-1">
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                            <p className="text-sm font-semibold text-slate-500">
                                Showing {filteredTours.length} Premium Expeditions
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="font-semibold text-slate-700">Sort by:</span>
                                <button className="flex items-center gap-1 font-bold text-slate-900">
                                    Recommended <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
                                <p className="text-slate-500 font-medium">Loading tours...</p>
                            </div>
                        )}
                        {error && <p className="text-center text-error py-12">{error}</p>}
                        
                        {!loading && !error && filteredTours.length === 0 && (
                            <p className="text-center text-slate-500 py-12">No tours match these filters yet.</p>
                        )}

                        {!loading && !error && filteredTours.length > 0 && (
                            <motion.div
                                variants={gridVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 relative"
                            >
                                {filteredTours.map((t) => <TourCard key={t.id} tour={t} />)}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
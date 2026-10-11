import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, ChevronLeft, ChevronRight, Waves, Mountain } from 'lucide-react';
import { destinationsApi } from '../../lib/api/destinations';
import DestinationCard from '../../components/public/destinations/DestinationCard';
import type { Destination } from '../../types/destination';

const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } }
};

export default function DestinationsListing() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [selectedRegion, setSelectedRegion] = useState('All Regions');
    const [selectedActivity, setSelectedActivity] = useState('Any Activity');
    const [selectedSeason, setSelectedSeason] = useState('All Seasons');

    // Active Route / Map highlight state
    const [activeRouteTab, setActiveRouteTab] = useState<'karakoram' | 'lakes'>('karakoram');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        destinationsApi
            .getAllActive()
            .then((data: Destination[]) => {
                setDestinations(data || []);
                setError('');
            })
            .catch(() => {
                setError('Could not load destinations at this time. Please try again later.');
            })
            .finally(() => setLoading(false));
    }, []);

    // Filter logic based on backend destination properties
    const filteredDestinations = useMemo(() => {
        return destinations.filter((dest) => {
            const matchesRegion =
                selectedRegion === 'All Regions' ||
                (dest.bestTimeToVisit && dest.bestTimeToVisit.toLowerCase().includes(selectedRegion.toLowerCase())) ||
                dest.name.toLowerCase().includes(selectedRegion.toLowerCase()) ||
                dest.description.toLowerCase().includes(selectedRegion.toLowerCase());

            const matchesActivity = selectedActivity === 'Any Activity';
            const matchesSeason = selectedSeason === 'All Seasons';

            return matchesRegion && matchesActivity && matchesSeason;
        });
    }, [destinations, selectedRegion, selectedActivity, selectedSeason]);

    return (
        <div className="bg-[#f8fafc] min-h-screen text-slate-800 pt-20">
            {/* 1. HERO SECTION */}
            <section className="relative h-[65vh] min-h-[480px] max-h-[640px] w-full flex items-center justify-start overflow-hidden">
                {/* Background Image */}
                <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000"
                    alt="Karakoram Mountain Lake Escape"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-transparent" />

                {/* Hero Content */}
                <div className="max-w-[1280px] mx-auto px-6 md:px-12 w-full relative z-10 text-left -mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-2xl space-y-4"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-[1.15]">
                            Discover Your <br />
                            Next Escape
                        </h1>
                        <p className="text-sm md:text-base text-slate-200/90 leading-relaxed max-w-xl font-normal">
                            Journey through the rugged heart of the Himalayas and the Karakorams. Experience luxury in the world's most untamed peaks.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* 2. FLOATING SEARCH FILTER BAR */}
            <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-20 -mt-16 md:-mt-14 mb-16">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-5 md:p-6 border border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        {/* Region Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                                Region
                            </label>
                            <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                            >
                                <option value="All Regions">All Regions</option>
                                <option value="Hunza">Hunza & Nagar</option>
                                <option value="Skardu">Skardu & Baltistan</option>
                                <option value="Swat">Swat & Chitral</option>
                                <option value="Ghanche">Ghanche</option>
                                <option value="Ghizer">Ghizer Valley</option>
                            </select>
                        </div>

                        {/* Activity Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                                Activity
                            </label>
                            <select
                                value={selectedActivity}
                                onChange={(e) => setSelectedActivity(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                            >
                                <option value="Any Activity">Any Activity</option>
                                <option value="Trekking">Trekking & Expeditions</option>
                                <option value="Culture">Cultural Discovery</option>
                                <option value="Luxury">Luxury Safaris</option>
                                <option value="Lakes">Alpine Lakes</option>
                            </select>
                        </div>

                        {/* Season Dropdown */}
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                                Season
                            </label>
                            <select
                                value={selectedSeason}
                                onChange={(e) => setSelectedSeason(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer"
                            >
                                <option value="All Seasons">All Seasons</option>
                                <option value="Spring">Spring (Apr - May)</option>
                                <option value="Summer">Summer (Jun - Aug)</option>
                                <option value="Autumn">Autumn (Sep - Nov)</option>
                            </select>
                        </div>

                        {/* Find Destinations Button */}
                        <div>
                            <button
                                type="button"
                                className="w-full bg-[#004e64] hover:bg-[#003848] text-white font-medium text-xs rounded-lg px-5 py-3 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                            >
                                <Search className="w-4 h-4" />
                                <span>Find Destinations</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. CURATED COLLECTIONS GRID SECTION */}
            <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-6">
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-widest block mb-1">
                            CURATED COLLECTIONS
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                            Unforgettable Landscapes
                        </h2>
                    </div>
                    <p className="text-xs text-slate-500 max-w-sm md:text-right">
                        Showing {filteredDestinations.length} destination{filteredDestinations.length === 1 ? '' : 's'} from the backend.
                    </p>
                </div>

                {/* Grid / States */}
                {loading && (
                    <div className="py-20 text-center text-slate-400 text-sm">
                        Loading destinations...
                    </div>
                )}

                {error && (
                    <div className="py-16 text-center text-red-600 bg-red-50 rounded-2xl border border-red-200">
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                {!loading && !error && filteredDestinations.length === 0 && (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80">
                        <p className="text-base font-semibold text-slate-700">No destinations found.</p>
                        {(selectedRegion !== 'All Regions' || selectedActivity !== 'Any Activity' || selectedSeason !== 'All Seasons') && (
                            <button
                                onClick={() => {
                                    setSelectedRegion('All Regions');
                                    setSelectedActivity('Any Activity');
                                    setSelectedSeason('All Seasons');
                                }}
                                className="mt-3 text-xs text-teal-700 font-semibold hover:underline"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && filteredDestinations.length > 0 && (
                    <motion.div
                        variants={gridVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7"
                    >
                        {filteredDestinations.map((destination) => (
                            <DestinationCard key={destination.id} destination={destination} />
                        ))}
                    </motion.div>
                )}

                {/* Pagination Controls */}
                {!loading && filteredDestinations.length > 0 && (
                    <div className="mt-14 flex items-center justify-center gap-2 text-xs font-semibold">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                            aria-label="Previous Page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => setCurrentPage(1)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                currentPage === 1 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            1
                        </button>

                        <button
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                            aria-label="Next Page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </section>

            {/* 4. INTERACTIVE TERRITORY GUIDE SECTION */}
            <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-20 border-t border-slate-200/60 mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left Info & Selector */}
                    <div className="lg:col-span-5 space-y-6">
                        <div>
                            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-widest block mb-1">
                                PLAN YOUR ROUTE
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold font-serif text-slate-900 tracking-tight">
                                Interactive Territory Guide
                            </h2>
                            <p className="text-xs text-slate-500 leading-relaxed mt-3">
                                Our topographic map highlights the best seasonal routes and luxury base-camps across Gilgit-Baltistan and Khyber Pakhtunkhwa.
                            </p>
                        </div>

                        {/* Route Option 1 */}
                        <div
                            onClick={() => setActiveRouteTab('karakoram')}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                                activeRouteTab === 'karakoram'
                                    ? 'bg-white border-slate-300 shadow-md ring-1 ring-slate-400'
                                    : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className="p-2.5 rounded-lg bg-teal-50 text-teal-800 shrink-0">
                                <Mountain className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Karakoram Range</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Home to 4 of the world's 14 8,000m peaks.
                                </p>
                            </div>
                        </div>

                        {/* Route Option 2 */}
                        <div
                            onClick={() => setActiveRouteTab('lakes')}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                                activeRouteTab === 'lakes'
                                    ? 'bg-white border-slate-300 shadow-md ring-1 ring-slate-400'
                                    : 'bg-slate-50 border-slate-200/80 hover:bg-white hover:border-slate-300'
                            }`}
                        >
                            <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-800 shrink-0">
                                <Waves className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">Alpine Lakes</h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Pristine glacial lakes over 2,500m altitude.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Interactive Topographic Map Visualizer */}
                    <div className="lg:col-span-7">
                        <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#1c3029] shadow-2xl border border-emerald-950 flex items-center justify-center p-6">
                            {/* Terrain Map Background Overlay Graphic */}
                            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2d5345_1px,transparent_1px)] [background-size:16px_16px]" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#14231e] via-transparent to-[#28483c]" />

                            {/* Topographic Contour Lines SVG Pattern */}
                            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 100 Q 250 50 500 150 T 1000 100" stroke="#4ade80" strokeWidth="1.5" fill="none" />
                                <path d="M0 250 Q 300 180 600 280 T 1200 200" stroke="#34d399" strokeWidth="1.5" fill="none" />
                                <path d="M0 400 Q 200 320 500 420 T 1000 380" stroke="#4ade80" strokeWidth="1" fill="none" />
                                <path d="M100 0 Q 350 300 700 100 T 1100 500" stroke="#6ee7b7" strokeWidth="1" fill="none" />
                            </svg>

                            {/* Interactive Pins */}
                            {/* Pin 1: K2 Peak */}
                            <div className="absolute top-[35%] right-[32%] z-20 flex flex-col items-center group cursor-pointer">
                                <div className="bg-[#142d24]/90 backdrop-blur-md text-emerald-100 text-[10px] font-bold px-3 py-1 rounded-md border border-emerald-500/40 shadow-lg mb-1 flex items-center gap-1.5">
                                    <MapPin className="w-3 h-3 text-emerald-400" />
                                    <span>{activeRouteTab === 'karakoram' ? 'K2 Peak' : 'Attabad Lake'}</span>
                                </div>
                                <div className="relative flex items-center justify-center">
                                    <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                                </div>
                            </div>

                            {/* Pin 2: Hunza */}
                            <div className="absolute top-[48%] left-[28%] z-20 flex flex-col items-center group cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-teal-300 opacity-50" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300" />
                                </div>
                            </div>

                            {/* Pin 3: Skardu */}
                            <div className="absolute bottom-[35%] right-[42%] z-20 flex flex-col items-center group cursor-pointer">
                                <div className="relative flex items-center justify-center">
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-200" />
                                </div>
                            </div>

                            {/* Territory Label Overlay */}
                            <div className="absolute bottom-4 left-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-emerald-200/80 font-mono">
                                Topography: Northern Pakistan 35°N 76°E
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. TAILORED TO YOU CTA BANNER */}
            <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-20">
                <div className="relative rounded-3xl bg-gradient-to-r from-[#00261e] via-[#024034] to-[#00261e] p-10 md:p-16 text-center shadow-2xl overflow-hidden border border-emerald-900/40">
                    {/* Background Subtle Radial Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-tight">
                            Tailored to You
                        </h2>
                        <p className="text-xs md:text-sm text-emerald-100/80 leading-relaxed">
                            Can't find what you're looking for? Our travel architects specialize in crafting bespoke itineraries for the discerning traveler.
                        </p>
                        
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <a
                                href="mailto:concierge@peakluxury.pk"
                                className="w-full sm:w-auto bg-white text-[#00261e] text-xs font-semibold px-7 py-3.5 rounded-full hover:bg-slate-100 transition-colors shadow-md text-center"
                            >
                                Contact Our Experts
                            </a>
                            <a
                                href="/tours"
                                className="w-full sm:w-auto border border-emerald-400/40 text-white text-xs font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-center"
                            >
                                View Private Tours
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
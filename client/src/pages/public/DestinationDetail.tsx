import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import {
    Clock,
    Calendar,
    MapPin,
    ArrowRight,
    ChevronRight,
    Mountain,
    Waves,
    Camera,
    Users,
    Send,
    Compass,
    TreePine,
} from 'lucide-react';
import { destinationsApi } from '../../lib/api/destinations';
import type { DestinationDetail as DestinationDetailType } from '../../types/destination';

/* ─── Fallback images ─── */
const HERO_FALLBACK =
    'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1920';
const GALLERY_IMAGES = [
    'https://images.unsplash.com/photo-1566837945700-30057527ade0?q=80&w=600',
    'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=600',
    'https://images.unsplash.com/photo-1570477266128-a5c72c8d2693?q=80&w=600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=600',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
];
const TOUR_FALLBACK =
    'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800';
const RELATED_DESTINATIONS = [
    {
        name: 'Hunza Valley',
        slug: 'hunza-valley',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800',
        desc: 'Explore the fairy-tale landscapes of Hunza Valley, home to the ancient Baltit Fort.',
    },
    {
        name: 'Swat Valley',
        slug: 'swat-valley',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
        desc: 'Known as the Switzerland of Pakistan, Swat Valley charms with its serene beauty.',
    },
];

/* ─── Landmark data (for enrichment) ─── */
const LANDMARK_DATA = [
    {
        name: 'Upper Kachura Lake',
        icon: Waves,
        desc: 'A turquoise gem accessible by a short hike, offering an emerald oasis with breathtakingly clear water. It is literally away from the hectic tourist spots.',
        details: ['Boating & Picnics', 'Scenic Hiking Trails'],
    },
    {
        name: 'Katpana Desert',
        icon: Mountain,
        desc: 'One of the highest cold deserts in the world, the Katpana desert offers an ethereal landscape covered in snow during winter, creating a surreal landscape.',
        details: ['Dune Walking', 'Photography Expeditions'],
    },
];

/* ─── Season chart data ─── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
type Season = 'peak' | 'good' | 'off';
const SEASON_MAP: Season[] = ['off', 'off', 'off', 'off', 'good', 'good', 'peak', 'peak', 'good', 'good', 'off', 'off'];
const SEASON_COLORS: Record<Season, string> = {
    peak: 'bg-primary text-white',
    good: 'bg-primary/15 text-primary',
    off: 'bg-slate-100 text-slate-400',
};
const SEASON_LABELS: Record<Season, string> = {
    peak: 'Peak Season',
    good: 'Good',
    off: 'Off-Season',
};

/* ─── Animation variants ─── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };

/* ─── Section wrapper with inView ─── */
function AnimatedSection({
    children,
    className = '',
    delay = 0,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.15 });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function DestinationDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [destination, setDestination] = useState<DestinationDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeSeasonFilter, setActiveSeasonFilter] = useState<'all' | Season>('all');

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        destinationsApi
            .getBySlug(slug)
            .then(setDestination)
            .catch(() => setError('This destination could not be found.'))
            .finally(() => setLoading(false));
    }, [slug]);

    /* ─── Loading ─── */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <p className="text-text-muted text-body-md">Loading destination...</p>
                </div>
            </div>
        );
    }

    /* ─── Error ─── */
    if (error || !destination) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                        <MapPin className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-error text-body-lg font-medium">
                        {error || 'Destination not found.'}
                    </p>
                    <Link
                        to="/destinations"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                    >
                        ← Back to Destinations
                    </Link>
                </div>
            </div>
        );
    }

    const regionTag = destination.bestTimeToVisit
        ? `GILGIT · BALTISTAN · PAKISTAN`
        : 'NORTHERN PAKISTAN';

    const filteredMonths =
        activeSeasonFilter === 'all'
            ? MONTHS
            : MONTHS.filter((_, i) => SEASON_MAP[i] === activeSeasonFilter);

    return (
        <div className="bg-background">
            {/* ═══════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════ */}
            <section className="relative h-[62vh] min-h-[480px] w-full overflow-hidden">
                {/* Background image */}
                <img
                    src={destination.coverImage || HERO_FALLBACK}
                    alt={destination.name}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3c34]/90 via-[#1a3c34]/40 to-[#1a3c34]/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c34]/30 to-transparent" />

                {/* Hero content */}
                <div className="relative z-10 h-full flex flex-col justify-end">
                    <div className="wrapper pb-14">
                        {/* Breadcrumb tags */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-wrap gap-2 mb-5"
                        >
                            {regionTag.split(' · ').map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white/90 text-[11px] font-semibold tracking-widest uppercase border border-white/10"
                                >
                                    {tag}
                                </span>
                            ))}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.35 }}
                            className="text-4xl md:text-6xl font-bold text-white font-heading tracking-tight leading-tight"
                        >
                            {destination.name}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="mt-4 text-white/80 text-body-lg max-w-2xl leading-relaxed"
                        >
                            {destination.description?.slice(0, 160) ||
                                'Where the Karakoram meets the Indus — discover a landscape of high-altitude deserts, crystalline lakes, and the gateway to the world\'s highest peaks.'}
                            {destination.description && destination.description.length > 160 ? '...' : ''}
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                MAIN CONTENT — Two Column Layout
            ═══════════════════════════════════════════════════════ */}
            <section className="wrapper py-16 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* ── LEFT COLUMN (2/3) ── */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Description */}
                        <AnimatedSection>
                            <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading tracking-tight mb-6">
                                The Crown Jewel of the North
                            </h2>
                            <p className="text-text-muted text-body-lg leading-relaxed">
                                {destination.description ||
                                    'Nestled in the breathtaking highlands and a gateway to the Crown Jewel of Northern Pakistan. At an elevation ranging 2,438-7,925m above sea level, the area is a mesmerizing combination of the rocks and deep gorges that sit at the foot of Skardu\'s icecap, where the world\'s highest cold desert meets mountain terrain.'}
                            </p>
                        </AnimatedSection>

                        {/* Visual Journey Gallery */}
                        <AnimatedSection delay={0.1}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl md:text-2xl font-bold text-on-surface font-heading">
                                    Visual Journey
                                </h3>
                                <Link
                                    to="/gallery"
                                    className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:underline group"
                                >
                                    View All 24 Photos
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {GALLERY_IMAGES.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: i * 0.08 }}
                                        className={`relative overflow-hidden rounded-xl group cursor-pointer ${
                                            i === 0 ? 'col-span-2 row-span-2 aspect-[4/3]' : 'aspect-square'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${destination.name} gallery ${i + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                        {i === 0 && (
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Camera className="w-5 h-5" />
                                                <span className="text-sm font-medium">View Gallery</span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* ── RIGHT COLUMN (1/3) — Plan Your Visit ── */}
                    <div className="lg:col-span-1">
                        <AnimatedSection delay={0.2}>
                            <div className="sticky top-24">
                                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg overflow-hidden">
                                    {/* Card header */}
                                    <div className="p-6 pb-4 border-b border-slate-100">
                                        <h3 className="text-lg font-bold text-on-surface font-heading">
                                            Plan Your Visit
                                        </h3>
                                        <p className="text-sm text-text-muted mt-1">
                                            Customize your trip with our personalized itinerary planner.
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Travel Dates
                                            </label>
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Select dates"
                                                    className="bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none w-full"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Group Size
                                            </label>
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                                <Users className="w-4 h-4 text-slate-400" />
                                                <select className="bg-transparent text-sm text-slate-700 focus:outline-none w-full appearance-none cursor-pointer">
                                                    <option>1 Person</option>
                                                    <option>2 People</option>
                                                    <option>3-5 People</option>
                                                    <option>6-10 People</option>
                                                    <option>10+ People</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Trip Type
                                            </label>
                                            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                                                <Compass className="w-4 h-4 text-slate-400" />
                                                <select className="bg-transparent text-sm text-slate-700 focus:outline-none w-full appearance-none cursor-pointer">
                                                    <option>Adventure & Trekking</option>
                                                    <option>Cultural Experience</option>
                                                    <option>Photography Tour</option>
                                                    <option>Luxury Retreat</option>
                                                    <option>Family Holiday</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                                Special Requests
                                            </label>
                                            <textarea
                                                placeholder="Transfers, dietary, activities, etc."
                                                rows={3}
                                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                                            />
                                        </div>

                                        <button className="w-full bg-primary hover:bg-primary-container text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-2">
                                            <Send className="w-4 h-4" />
                                            Book Explorer
                                        </button>

                                        <p className="text-xs text-slate-400 text-center pt-1">
                                            Free cancellation • Expert advice included
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                MUST-VISIT LANDMARKS
            ═══════════════════════════════════════════════════════ */}
            <section className="wrapper pb-20">
                <AnimatedSection>
                    <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-heading tracking-tight mb-10">
                        Must-Visit Landmarks
                    </h2>
                </AnimatedSection>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {LANDMARK_DATA.map((landmark, i) => (
                        <motion.div key={i} variants={fadeUp}>
                            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 hover:shadow-lg transition-shadow duration-300 group h-full">
                                {/* Icon */}
                                <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center mb-5 group-hover:bg-primary/12 transition-colors">
                                    <landmark.icon className="w-7 h-7 text-primary" />
                                </div>

                                <h3 className="text-lg font-bold text-on-surface font-heading mb-2">
                                    {landmark.name}
                                </h3>
                                <p className="text-text-muted text-sm leading-relaxed mb-5">
                                    {landmark.desc}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {landmark.details.map((detail, j) => (
                                        <div key={j} className="flex items-center gap-1.5 text-xs text-slate-500">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                BEST TIME TO VISIT
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-[#f0f5f3] py-16 md:py-20">
                <div className="wrapper">
                    <AnimatedSection>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-heading tracking-tight">
                                    Best Time to Visit
                                </h2>
                                <p className="text-text-muted text-sm mt-1">
                                    Plan your luxury retreat according to the seasons.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-full p-1 shadow-sm border border-slate-200/80">
                                {[
                                    { key: 'all', label: 'All Months' },
                                    { key: 'peak', label: 'Peak Season' },
                                ] .map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveSeasonFilter(key as 'all' | Season)}
                                        className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                                            activeSeasonFilter === key
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'text-slate-500 hover:text-primary'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AnimatedSection>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3"
                    >
                        {MONTHS.map((month, i) => {
                            const season = SEASON_MAP[i];
                            const isVisible =
                                activeSeasonFilter === 'all' || season === activeSeasonFilter;
                            return (
                                <motion.div
                                    key={month}
                                    variants={fadeUp}
                                    className={`transition-all duration-300 ${
                                        isVisible ? 'opacity-100 scale-100' : 'opacity-30 scale-95'
                                    }`}
                                >
                                    <div
                                        className={`rounded-2xl p-4 text-center ${SEASON_COLORS[season]} transition-all duration-200 hover:shadow-md cursor-default`}
                                    >
                                        <span className="block text-sm font-bold">{month}</span>
                                        <span className="block text-[10px] mt-1 opacity-70 font-medium">
                                            {SEASON_LABELS[season]}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-slate-200/60">
                        {(['peak', 'good', 'off'] as Season[]).map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${
                                        s === 'peak'
                                            ? 'bg-primary'
                                            : s === 'good'
                                            ? 'bg-primary/30'
                                            : 'bg-slate-200'
                                    }`}
                                />
                                <span className="text-xs text-slate-500 font-medium">
                                    {SEASON_LABELS[s]}
                                </span>
                            </div>
                        ))}
                        {destination.bestTimeToVisit && (
                            <span className="text-xs text-primary font-semibold ml-auto flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                Recommended: {destination.bestTimeToVisit}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════
                EXCLUSIVE TOURS
            ═══════════════════════════════════════════════════════ */}
            <section className="wrapper py-16 md:py-20">
                <AnimatedSection>
                    <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-heading tracking-tight mb-3">
                        Exclusive {destination.name} Tours
                    </h2>
                    <p className="text-text-muted text-body-md mb-10 max-w-2xl">
                        Handcrafted itineraries designed for the discerning traveller.
                    </p>
                </AnimatedSection>

                {destination.tours.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
                        <TreePine className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-text-muted text-body-md">
                            No tours are currently listed for this destination.
                        </p>
                        <Link
                            to="/tours"
                            className="inline-flex items-center gap-2 mt-4 text-primary font-semibold text-sm hover:underline"
                        >
                            Browse All Tours <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {destination.tours.map((tour) => (
                            <motion.div key={tour.id} variants={fadeUp}>
                                <Link
                                    to={`/tours/${tour.slug}`}
                                    className="group block bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
                                >
                                    {/* Image */}
                                    <div className="relative h-52 overflow-hidden">
                                        <img
                                            src={TOUR_FALLBACK}
                                            alt={tour.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                                <Clock size={10} />
                                                {tour.durationDays} Days
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5">
                                        <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors font-heading text-lg">
                                            {tour.title}
                                        </h3>
                                        <p className="text-text-muted text-sm mt-2 line-clamp-2">
                                            Discover handcrafted luxury, epic vistas and life-enriching stories.
                                        </p>

                                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                                            <div>
                                                <span className="text-primary font-bold text-lg">
                                                    ${Number(tour.basePrice).toLocaleString()}
                                                </span>
                                                <span className="text-text-muted text-xs ml-1">/person</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                                                Details
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </section>

            {/* ═══════════════════════════════════════════════════════
                CONTINUE YOUR JOURNEY
            ═══════════════════════════════════════════════════════ */}
            <section className="bg-[#1a3c34] py-16 md:py-20">
                <div className="wrapper">
                    <AnimatedSection>
                        <h2 className="text-2xl md:text-3xl font-bold text-white font-heading tracking-tight text-center mb-3">
                            Continue Your Journey
                        </h2>
                        <p className="text-white/60 text-center text-body-md mb-12 max-w-xl mx-auto">
                            Explore other breathtaking destinations across Northern Pakistan.
                        </p>
                    </AnimatedSection>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                        {RELATED_DESTINATIONS.filter((d) => d.slug !== slug).map((dest, i) => (
                            <motion.div key={dest.slug} variants={fadeUp}>
                                <Link
                                    to={`/destinations/${dest.slug}`}
                                    className="group block relative h-72 md:h-80 rounded-2xl overflow-hidden"
                                >
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                        <h3 className="text-xl md:text-2xl font-bold text-white font-heading">
                                            {dest.name}
                                        </h3>
                                        <p className="text-white/70 text-sm mt-2 max-w-sm line-clamp-2">
                                            {dest.desc}
                                        </p>
                                        <div className="mt-4 inline-flex items-center gap-2 text-white text-sm font-semibold bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 group-hover:bg-white/25 transition-colors">
                                            Explore Now
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
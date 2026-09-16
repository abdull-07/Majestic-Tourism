import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, MapPin, Mountain } from 'lucide-react';
import { toursApi } from '../../lib/api/tours';
import ItineraryAccordion from '../../components/public/tours/ItineraryAccordion';
import AvailabilityPicker from '../../components/public/tours/AvailabilityPicker';
import ReviewsList from '../../components/public/tours/ReviewsList';
import type { TourDetail as TourDetailType } from '../../types/tour';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1600';

export default function TourDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [tour, setTour] = useState<TourDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!slug) return;
        setLoading(true);
        toursApi
            .getBySlug(slug)
            .then(setTour)
            .catch(() => setError('This tour could not be found.'))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div className="wrapper py-24 text-center text-text-muted">Loading tour...</div>;
    if (error || !tour) return <div className="wrapper py-24 text-center text-error">{error || 'Tour not found.'}</div>;

    const cover = tour.images?.find((i) => i.isCover)?.url || tour.images?.[0]?.url || FALLBACK_IMG;

    return (
        <div>
            <section className="relative h-[60vh] min-h-[420px] w-full flex items-end overflow-hidden">
                <img src={cover} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="relative z-10 wrapper pb-12 text-white">
                    <Link to={`/destinations/${tour.destination.slug}`} className="flex items-center gap-1 text-body-sm opacity-80 mb-2 w-fit">
                        <MapPin size={14} /> {tour.destination.name}
                    </Link>
                    <h1 className="text-display-lg-mobile md:text-display-lg">{tour.title}</h1>
                </div>
            </section>

            <section className="wrapper py-16 grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                <div className="lg:col-span-2 space-y-16">
                    <div className="flex flex-wrap gap-6 text-body-sm text-text-muted">
                        <div className="flex items-center gap-2"><Clock size={16} className="text-primary" /> {tour.durationDays} Days / {tour.durationNights} Nights</div>
                        <div className="flex items-center gap-2"><Users size={16} className="text-primary" /> {tour.minGroupSize}–{tour.maxGroupSize} people</div>
                        <div className="flex items-center gap-2"><Mountain size={16} className="text-primary" /> {tour.difficultyLevel}</div>
                    </div>

                    <div>
                        <h2 className="text-headline-sm text-primary mb-4">Overview</h2>
                        <p className="text-text-muted text-body-md leading-relaxed">{tour.description}</p>
                    </div>

                    {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {tour.inclusions.length > 0 && (
                                <div>
                                    <h3 className="text-headline-sm text-primary mb-3">Included</h3>
                                    <ul className="space-y-2 text-body-sm text-text-muted">
                                        {tour.inclusions.map((item) => <li key={item}>✓ {item}</li>)}
                                    </ul>
                                </div>
                            )}
                            {tour.exclusions.length > 0 && (
                                <div>
                                    <h3 className="text-headline-sm text-primary mb-3">Not Included</h3>
                                    <ul className="space-y-2 text-body-sm text-text-muted">
                                        {tour.exclusions.map((item) => <li key={item}>✕ {item}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <h2 className="text-headline-sm text-primary mb-4">Itinerary</h2>
                        <ItineraryAccordion days={tour.itinerary} />
                    </div>

                    <div>
                        <h2 className="text-headline-sm text-primary mb-4">Traveler Reviews</h2>
                        <ReviewsList reviews={tour.reviews} />
                    </div>
                </div>

                <div>
                    <AvailabilityPicker
                        tourId={tour.id}
                        basePrice={Number(tour.basePrice)}
                        childPrice={tour.childPrice ? Number(tour.childPrice) : null}
                        slots={tour.availability}
                    />
                </div>
            </section>
        </div>
    );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, MapPin, Trash2 } from 'lucide-react';
import { wishlistApi } from '../../lib/api/wishlist';
import { useWishlistStore } from '../../store/useWishlistStore';
import type { WishlistItem } from '../../types/wishlist';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600';

export default function Wishlist() {
    const removeFromStore = useWishlistStore((s) => s.remove);
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        wishlistApi.getAll().then(setItems).finally(() => setLoading(false));
    }, []);

    const handleRemove = async (tourId: string) => {
        setRemovingId(tourId);
        try {
            await removeFromStore(tourId);
            setItems((prev) => prev.filter((i) => i.tourId !== tourId));
        } catch {
            alert('Could not remove this tour — please try again.');
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div>
            <h2 className="text-headline-sm text-primary mb-4">Wishlist</h2>

            {loading ? (
                <p className="text-body-sm text-text-muted">Loading...</p>
            ) : items.length === 0 ? (
                <div className="card p-8 text-center">
                    <Heart className="mx-auto text-mountain-mist mb-2" size={32} />
                    <p className="text-text-muted mb-4">You haven't saved any tours yet.</p>
                    <Link to="/tours" className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold inline-block">
                        Browse Tours
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                    {items.map(({ id, tourId, tour }) => (
                        <div key={id} className="card overflow-hidden group">
                            <Link to={`/tours/${tour.slug}`} className="block">
                                <div className="h-44 overflow-hidden">
                                    <img
                                        src={tour.images[0]?.url || FALLBACK_IMG}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                                <div className="p-5 pb-3">
                                    <p className="flex items-center gap-1 text-body-sm text-text-muted mb-1">
                                        <MapPin size={14} /> {tour.destination.name}
                                    </p>
                                    <h3 className="font-bold text-primary mb-3">{tour.title}</h3>
                                    <div className="flex items-center justify-between text-body-sm">
                                        <span className="flex items-center gap-1 text-text-muted"><Clock size={14} /> {tour.durationDays} Days</span>
                                        <span className="text-secondary font-bold">${Number(tour.basePrice).toLocaleString()}</span>
                                    </div>
                                </div>
                            </Link>
                            <div className="px-5 pb-4">
                                <button
                                    onClick={() => handleRemove(tourId)}
                                    disabled={removingId === tourId}
                                    className="flex items-center gap-1 text-body-sm text-error hover:underline disabled:opacity-50"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountApi } from '../../lib/api/account';
import BookingCard from '../../components/dashboard/BookingCard';
import type { AccountBooking } from '../../types/account';

const filters = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED'];

export default function MyBookings() {
    const [bookings, setBookings] = useState<AccountBooking[]>([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        accountApi.getBookings().then(setBookings).finally(() => setLoading(false));
    }, []);

    const visible = filter === 'All' ? bookings : bookings.filter((b) => b.status === filter);

    return (
        <div>
            <h2 className="text-headline-sm text-primary mb-4">My Bookings</h2>

            <div className="flex gap-2 mb-6 flex-wrap">
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full label transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-body-sm text-text-muted">Loading...</p>
            ) : visible.length === 0 ? (
                <div className="card p-8 text-center">
                    <p className="text-text-muted mb-4">
                        {bookings.length === 0 ? "You haven't booked a trip yet." : 'No bookings match this filter.'}
                    </p>
                    {bookings.length === 0 && (
                        <Link to="/tours" className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold inline-block">
                            Browse Tours
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {visible.map((b) => <BookingCard key={b.id} booking={b} />)}
                </div>
            )}
        </div>
    );
}
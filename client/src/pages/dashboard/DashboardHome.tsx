import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountApi } from '../../lib/api/account';
import BookingCard from '../../components/dashboard/BookingCard';
import type { AccountBooking } from '../../types/account';

export default function DashboardHome() {
    const [bookings, setBookings] = useState<AccountBooking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        accountApi.getBookings().then(setBookings).finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-body-sm text-text-muted">Loading...</p>;

    const upcoming = bookings
        .filter((b) => ['PENDING', 'CONFIRMED'].includes(b.status) && new Date(b.availability.departureDate) >= new Date())
        .sort((a, b) => +new Date(a.availability.departureDate) - +new Date(b.availability.departureDate));

    const totalPaid = bookings.reduce((sum, b) => sum + b.paidAmount, 0);
    const completed = bookings.filter((b) => b.status === 'COMPLETED').length;

    const stats = [
        { label: 'Total Bookings', value: bookings.length },
        { label: 'Upcoming Trips', value: upcoming.length },
        { label: 'Trips Completed', value: completed },
        { label: 'Total Paid', value: `$${totalPaid.toLocaleString()}` },
    ];

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="card p-5">
                        <p className="text-text-muted text-body-sm mb-1">{s.label}</p>
                        <p className="text-headline-sm text-primary">{s.value}</p>
                    </div>
                ))}
            </div>

            <div>
                <h2 className="text-headline-sm text-primary mb-4">Next Trip</h2>
                {upcoming.length > 0 ? (
                    <BookingCard booking={upcoming[0]} />
                ) : (
                    <div className="card p-8 text-center">
                        <p className="text-text-muted mb-4">You have no upcoming trips.</p>
                        <Link to="/tours" className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold inline-block">
                            Browse Tours
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
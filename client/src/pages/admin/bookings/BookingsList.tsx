import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';
import { adminBookingsApi } from '../../../lib/api/admin-bookings';
import StatusBadge from '../../../components/admin/StatusBadge';
import type { AdminBookingListItem } from '../../../types/admin-booking';

const statusFilters = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED'];

export default function BookingsList() {
    const [bookings, setBookings] = useState<AdminBookingListItem[]>([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        adminBookingsApi
            .getAll(filter === 'All' ? undefined : filter)
            .then(setBookings)
            .finally(() => setLoading(false));
    }, [filter]);

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-headline-sm text-primary">Bookings</h1>
                <p className="text-body-sm text-text-muted">All bookings across guests and registered customers</p>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                {statusFilters.map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`px-4 py-1.5 rounded-full label transition-colors ${filter === s ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <div className="card overflow-hidden">
                {loading ? (
                    <p className="p-6 text-body-sm text-text-muted">Loading...</p>
                ) : bookings.length === 0 ? (
                    <div className="p-10 text-center">
                        <CalendarCheck className="mx-auto text-mountain-mist mb-2" size={32} />
                        <p className="text-body-sm text-text-muted">No bookings match this filter.</p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="bg-surface-container-low border-b border-mountain-mist text-left text-text-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Booking #</th>
                                <th className="px-4 py-3 font-medium">Tour</th>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Travelers</th>
                                <th className="px-4 py-3 font-medium">Total</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mountain-mist">
                            {bookings.map((b) => (
                                <tr key={b.id} className="hover:bg-surface-container-low cursor-pointer" onClick={() => (window.location.href = `/admin/bookings/${b.id}`)}>
                                    <td className="px-4 py-3 font-medium text-primary">
                                        <Link to={`/admin/bookings/${b.id}`}>{b.bookingNumber}</Link>
                                    </td>
                                    <td className="px-4 py-3 text-on-surface">{b.tour.title}</td>
                                    <td className="px-4 py-3 text-text-muted">{b.user?.fullName || 'Guest'}</td>
                                    <td className="px-4 py-3 text-text-muted">{b.adults + b.children}</td>
                                    <td className="px-4 py-3 text-secondary font-semibold">${Number(b.totalAmount).toLocaleString()}</td>
                                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                                    <td className="px-4 py-3 text-text-muted">{new Date(b.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
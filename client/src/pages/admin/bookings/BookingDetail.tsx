import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminBookingsApi } from '../../../lib/api/admin-bookings';
import StatusBadge from '../../../components/admin/StatusBadge';
import type { AdminBookingDetail as BookingDetailType } from '../../../types/admin-booking';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED'];

export default function BookingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<BookingDetailType | null>(null);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const load = () => {
        if (!id) return;
        adminBookingsApi.getOne(id).then(setBooking);
    };

    useEffect(load, [id]);

    const handleStatusChange = async (status: string) => {
        if (!id) return;
        setError('');
        setUpdating(true);
        try {
            await adminBookingsApi.updateStatus(id, status);
            load();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (!booking) return <p className="text-body-sm text-text-muted">Loading...</p>;

    return (
        <div className="max-w-3xl">
            <button onClick={() => navigate('/admin/bookings')} className="flex items-center gap-1 text-body-sm text-text-muted hover:text-primary mb-4">
                <ArrowLeft size={14} /> Back to Bookings
            </button>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-headline-sm text-primary">{booking.bookingNumber}</h1>
                    <Link to={`/admin/tours/${booking.tour.slug}/edit`} className="text-body-sm text-secondary hover:underline">
                        {booking.tour.title}
                    </Link>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card p-6">
                    <h3 className="font-semibold text-primary mb-4">Customer</h3>
                    {booking.user ? (
                        <div className="text-body-sm space-y-1">
                            <p className="font-medium text-on-surface">{booking.user.fullName}</p>
                            <p className="text-text-muted">{booking.user.email}</p>
                            {booking.user.phone && <p className="text-text-muted">{booking.user.phone}</p>}
                        </div>
                    ) : (
                        <div className="text-body-sm space-y-1">
                            <span className="label text-tertiary mb-1 block">Guest Booking</span>
                            <p className="font-medium text-on-surface">{booking.guestName}</p>
                            <p className="text-text-muted">{booking.guestEmail}</p>
                            <p className="text-text-muted">{booking.guestPhone}</p>
                        </div>
                    )}
                </div>

                <div className="card p-6">
                    <h3 className="font-semibold text-primary mb-4">Trip Details</h3>
                    <div className="text-body-sm space-y-1 text-text-muted">
                        <p>Departure: <span className="text-on-surface">{new Date(booking.availability.departureDate).toLocaleDateString()}</span></p>
                        <p>Travelers: <span className="text-on-surface">{booking.adults} adults, {booking.children} children</span></p>
                        <p>Total: <span className="text-secondary font-semibold">${Number(booking.totalAmount).toLocaleString()}</span></p>
                        {booking.holdExpiresAt && (
                            <p>Hold expires: <span className="text-on-surface">{new Date(booking.holdExpiresAt).toLocaleString()}</span></p>
                        )}
                    </div>
                </div>
            </div>

            <div className="card p-6 mb-6">
                <h3 className="font-semibold text-primary mb-4">Payments</h3>
                {booking.payments.length === 0 ? (
                    <p className="text-body-sm text-text-muted">No payments submitted yet.</p>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="text-left text-text-muted border-b border-mountain-mist">
                            <tr><th className="py-2">Method</th><th className="py-2">Amount</th><th className="py-2">Status</th><th className="py-2">Date</th></tr>
                        </thead>
                        <tbody>
                            {booking.payments.map((p) => (
                                <tr key={p.id} className="border-b border-mountain-mist last:border-0">
                                    <td className="py-2">{p.method}</td>
                                    <td className="py-2">${Number(p.amount).toLocaleString()}</td>
                                    <td className="py-2"><StatusBadge status={p.status} /></td>
                                    <td className="py-2 text-text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <Link to="/admin/payments" className="text-secondary text-body-sm font-semibold mt-3 inline-block hover:underline">
                    Manage payments →
                </Link>
            </div>

            <div className="card p-6">
                <h3 className="font-semibold text-primary mb-4">Update Status</h3>
                <div className="flex gap-2 flex-wrap">
                    {STATUS_OPTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            disabled={updating || booking.status === s}
                            className={`px-4 py-2 rounded-lg text-body-sm font-semibold transition-colors disabled:opacity-40 ${booking.status === s ? 'bg-primary text-white' : 'border border-mountain-mist hover:bg-surface-container-low'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
                {error && <p className="text-body-sm text-error mt-3">{error}</p>}
                <p className="text-body-sm text-text-muted mt-3">
                    Marking as <strong>COMPLETED</strong> allows the customer to leave a review. Marking as{' '}
                    <strong>CANCELLED</strong> releases the held seats back to availability.
                </p>
            </div>
        </div>
    );
}
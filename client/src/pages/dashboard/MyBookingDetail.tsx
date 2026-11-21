import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { accountApi } from '../../lib/api/account';
import StatusBadge from '../../components/admin/StatusBadge';
import type { AccountBookingDetail } from '../../types/account';

export default function MyBookingDetail() {
    const { id } = useParams<{ id: string }>();
    const [booking, setBooking] = useState<AccountBookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        accountApi
            .getBooking(id)
            .then(setBooking)
            .catch(() => setError('This booking could not be found.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p className="text-body-sm text-text-muted">Loading...</p>;
    if (error || !booking) return <p className="text-error">{error || 'Booking not found.'}</p>;

    const balance = Math.max(0, Number(booking.totalAmount) - booking.paidAmount);

    return (
        <div className="space-y-6">
            <Link to="/dashboard/bookings" className="flex items-center gap-1 text-body-sm text-text-muted hover:text-primary w-fit">
                <ArrowLeft size={14} /> Back to My Bookings
            </Link>

            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-body-sm text-text-muted">#{booking.bookingNumber}</p>
                    <h2 className="text-headline-sm text-primary">{booking.tour.title}</h2>
                    <Link to={`/tours/${booking.tour.slug}`} className="text-body-sm text-secondary hover:underline">
                        View tour page
                    </Link>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            {booking.status === 'PENDING' && booking.holdExpiresAt && (
                <div className="card p-4 border-l-4 !border-l-tertiary text-body-sm text-text-muted">
                    Your seats are held until <strong>{new Date(booking.holdExpiresAt).toLocaleString()}</strong>.
                    If payment isn't completed by then, the booking expires and the seats are released.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                    <h3 className="font-semibold text-primary mb-4">Trip Details</h3>
                    <div className="text-body-sm space-y-2 text-text-muted">
                        <p>Destination: <span className="text-on-surface">{booking.tour.destination.name}</span></p>
                        <p>Departure: <span className="text-on-surface">{new Date(booking.availability.departureDate).toLocaleDateString()}</span></p>
                        <p>Travelers: <span className="text-on-surface">{booking.adults} adults, {booking.children} children</span></p>
                        <p>Booked on: <span className="text-on-surface">{new Date(booking.createdAt).toLocaleDateString()}</span></p>
                    </div>
                </div>

                <div className="card p-6">
                    <h3 className="font-semibold text-primary mb-4">Payment Summary</h3>
                    <div className="text-body-sm space-y-2">
                        <div className="flex justify-between"><span className="text-text-muted">Total</span><span>${Number(booking.totalAmount).toLocaleString()}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted">Paid (verified)</span><span className="text-primary">${booking.paidAmount.toLocaleString()}</span></div>
                        <div className="flex justify-between border-t border-mountain-mist pt-2 font-semibold">
                            <span>Balance</span><span className={balance > 0 ? 'text-tertiary' : 'text-primary'}>${balance.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-6">
                <h3 className="font-semibold text-primary mb-4">Payment History</h3>
                {booking.payments.length === 0 ? (
                    <p className="text-body-sm text-text-muted">No payments submitted yet.</p>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="text-left text-text-muted border-b border-mountain-mist">
                            <tr><th className="py-2">Date</th><th className="py-2">Method</th><th className="py-2">Amount</th><th className="py-2">Status</th></tr>
                        </thead>
                        <tbody>
                            {booking.payments.map((p) => (
                                <tr key={p.id} className="border-b border-mountain-mist last:border-0">
                                    <td className="py-2 text-text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2">{p.method}</td>
                                    <td className="py-2">${Number(p.amount).toLocaleString()}</td>
                                    <td className="py-2"><StatusBadge status={p.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
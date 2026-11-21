import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import StatusBadge from '../admin/StatusBadge';
import type { AccountBooking } from '../../types/account';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600';

export default function BookingCard({ booking }: { booking: AccountBooking }) {
    const cover = booking.tour.images[0]?.url || FALLBACK_IMG;
    const balance = Math.max(0, Number(booking.totalAmount) - booking.paidAmount);

    return (
        <Link to={`/dashboard/bookings/${booking.id}`} className="card overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-shadow">
            <img src={cover} alt={booking.tour.title} className="w-full sm:w-48 h-40 sm:h-auto object-cover" />
            <div className="p-5 flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                        <p className="text-body-sm text-text-muted">{booking.tour.destination.name}</p>
                        <h3 className="font-bold text-primary">{booking.tour.title}</h3>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                <div className="flex flex-wrap gap-4 text-body-sm text-text-muted mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(booking.availability.departureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={14} /> {booking.adults + booking.children} traveler{booking.adults + booking.children === 1 ? '' : 's'}
                    </span>
                </div>

                <div className="flex items-center justify-between text-body-sm">
                    <span className="text-text-muted">#{booking.bookingNumber}</span>
                    <span>
                        <span className="text-secondary font-bold">${Number(booking.totalAmount).toLocaleString()}</span>
                        {booking.status === 'PENDING' && balance > 0 && (
                            <span className="text-tertiary"> · ${balance.toLocaleString()} due</span>
                        )}
                    </span>
                </div>
            </div>
        </Link>
    );
}
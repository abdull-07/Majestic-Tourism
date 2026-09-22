import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import type { TourAvailabilitySlot } from '../../../types/tour';

type Props = {
    tourId: string;
    basePrice: number;
    childPrice: number | null;
    slots: TourAvailabilitySlot[];
};

export default function AvailabilityPicker({ tourId, basePrice, childPrice, slots }: Props) {
    const navigate = useNavigate();
    const [selectedSlot, setSelectedSlot] = useState<string>(slots[0]?.id ?? '');
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const rate = childPrice ?? basePrice;
    const total = adults * basePrice + children * rate;

    const handleBook = () => {
        if (!selectedSlot) return;
        navigate(`/booking?tourId=${tourId}&availabilityId=${selectedSlot}&adults=${adults}&children=${children}`);
    };

    if (slots.length === 0) {
        return (
            <div className="card p-6 text-center text-text-muted">
                No upcoming departure dates are open for booking right now — check back soon.
            </div>
        );
    }

    return (
        <div className="card p-6 sticky top-24">
            <h3 className="text-headline-sm text-primary mb-4">Book This Tour</h3>

            <label className="label text-primary mb-2 block">Departure Date</label>
            <div className="space-y-2 mb-5">
                {slots.map((slot) => {
                    const remaining = slot.totalSeats - slot.bookedSeats;
                    return (
                        <button
                            key={slot.id}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border text-left transition-colors ${selectedSlot === slot.id ? 'border-primary bg-primary-fixed/30' : 'border-mountain-mist'
                                }`}
                        >
                            <span className="flex items-center gap-2 text-body-sm font-medium">
                                <Calendar size={14} /> {new Date(slot.departureDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="text-body-sm text-text-muted">{remaining} seats left</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                    <label className="label text-primary mb-2 block">Adults</label>
                    <div className="flex items-center border border-mountain-mist rounded-lg">
                        <button onClick={() => setAdults((n) => Math.max(1, n - 1))} className="px-3 py-2 text-lg">−</button>
                        <span className="flex-1 text-center">{adults}</span>
                        <button onClick={() => setAdults((n) => n + 1)} className="px-3 py-2 text-lg">+</button>
                    </div>
                </div>
                <div>
                    <label className="label text-primary mb-2 block">Children</label>
                    <div className="flex items-center border border-mountain-mist rounded-lg">
                        <button onClick={() => setChildren((n) => Math.max(0, n - 1))} className="px-3 py-2 text-lg">−</button>
                        <span className="flex-1 text-center">{children}</span>
                        <button onClick={() => setChildren((n) => n + 1)} className="px-3 py-2 text-lg">+</button>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-text-muted text-body-sm mb-4">
                <Users size={14} /> {adults + children} traveler{adults + children === 1 ? '' : 's'} total
            </div>

            <div className="flex items-center justify-between border-t border-mountain-mist pt-4 mb-5">
                <span className="text-body-md">Total</span>
                <span className="text-headline-sm text-primary">${total.toLocaleString()}</span>
            </div>

            <button
                onClick={handleBook}
                disabled={!selectedSlot}
                className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
            >
                Continue to Booking
            </button>
        </div>
    );
}
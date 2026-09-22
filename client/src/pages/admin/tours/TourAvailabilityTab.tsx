import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminToursApi } from '../../../lib/api/admin-tours';
import type { AdminTourAvailability } from '../../../types/admin-tour';

type Props = { tourId: string; slots: AdminTourAvailability[]; onChange: () => void };

export default function TourAvailabilityTab({ tourId, slots, onChange }: Props) {
    const [adding, setAdding] = useState(false);
    const [date, setDate] = useState('');
    const [seats, setSeats] = useState(10);
    const [error, setError] = useState('');

    const handleAdd = async () => {
        setError('');
        try {
            await adminToursApi.addAvailability(tourId, { departureDate: date, totalSeats: seats });
            setAdding(false);
            setDate('');
            onChange();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add departure date');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this departure date?')) return;
        try {
            await adminToursApi.removeAvailability(id);
            onChange();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete — it may already have bookings');
        }
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Availability</h3>
                <button onClick={() => setAdding(true)} className="flex items-center gap-1 text-secondary font-semibold text-body-sm">
                    <Plus size={14} /> Add Date
                </button>
            </div>

            {adding && (
                <div className="border border-secondary rounded-lg p-4 mb-4 flex items-end gap-3">
                    <div>
                        <label className="label text-primary mb-1 block">Departure Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-mountain-mist rounded-lg px-3 py-2 text-body-sm" />
                    </div>
                    <div>
                        <label className="label text-primary mb-1 block">Total Seats</label>
                        <input type="number" min={1} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className="border border-mountain-mist rounded-lg px-3 py-2 text-body-sm w-24" />
                    </div>
                    <button onClick={handleAdd} className="bg-primary text-white px-4 py-2 rounded-lg text-body-sm font-semibold">Save</button>
                    <button onClick={() => setAdding(false)} className="border border-mountain-mist px-4 py-2 rounded-lg text-body-sm">Cancel</button>
                </div>
            )}
            {error && <p className="text-body-sm text-error mb-3">{error}</p>}

            {slots.length === 0 ? (
                <p className="text-body-sm text-text-muted">No departure dates yet.</p>
            ) : (
                <table className="w-full text-body-sm">
                    <thead className="text-left text-text-muted border-b border-mountain-mist">
                        <tr><th className="py-2">Date</th><th className="py-2">Seats</th><th className="py-2">Status</th><th></th></tr>
                    </thead>
                    <tbody>
                        {slots.map((slot) => (
                            <tr key={slot.id} className="border-b border-mountain-mist last:border-0">
                                <td className="py-2">{new Date(slot.departureDate).toLocaleDateString()}</td>
                                <td className="py-2">{slot.bookedSeats} / {slot.totalSeats}</td>
                                <td className="py-2">{slot.status}</td>
                                <td className="py-2 text-right"><button onClick={() => handleDelete(slot.id)} className="text-error"><Trash2 size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
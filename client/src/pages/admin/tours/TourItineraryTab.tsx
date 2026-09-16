import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { adminToursApi } from '../../../lib/api/admin-tours';
import type { AdminTourItineraryDay } from '../../../types/admin-tour';

type Props = { tourId: string; days: AdminTourItineraryDay[]; onChange: () => void };

const emptyDay = { dayNumber: 1, title: '', description: '' };

export default function TourItineraryTab({ tourId, days, onChange }: Props) {
    const [editingId, setEditingId] = useState<string | 'new' | null>(null);
    const [form, setForm] = useState(emptyDay);
    const [error, setError] = useState('');

    const startAdd = () => {
        setForm({ dayNumber: days.length + 1, title: '', description: '' });
        setEditingId('new');
    };

    const startEdit = (day: AdminTourItineraryDay) => {
        setForm({ dayNumber: day.dayNumber, title: day.title, description: day.description });
        setEditingId(day.id);
    };

    const handleSave = async () => {
        setError('');
        try {
            if (editingId === 'new') {
                await adminToursApi.addItineraryDay(tourId, form);
            } else if (editingId) {
                await adminToursApi.updateItineraryDay(editingId, form);
            }
            setEditingId(null);
            onChange();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save itinerary day');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this itinerary day?')) return;
        await adminToursApi.removeItineraryDay(id);
        onChange();
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Itinerary</h3>
                <button onClick={startAdd} className="flex items-center gap-1 text-secondary font-semibold text-body-sm">
                    <Plus size={14} /> Add Day
                </button>
            </div>

            {editingId && (
                <div className="border border-secondary rounded-lg p-4 mb-4 space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                        <input type="number" min={1} value={form.dayNumber} onChange={(e) => setForm((f) => ({ ...f, dayNumber: Number(e.target.value) }))}
                            className="border border-mountain-mist rounded-lg px-3 py-2 text-body-sm" placeholder="Day #" />
                        <input type="text" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            className="col-span-3 border border-mountain-mist rounded-lg px-3 py-2 text-body-sm" placeholder="Day title" />
                    </div>
                    <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full border border-mountain-mist rounded-lg px-3 py-2 text-body-sm" placeholder="What happens this day..." />
                    {error && <p className="text-body-sm text-error">{error}</p>}
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="bg-primary text-white px-4 py-1.5 rounded-lg text-body-sm font-semibold">Save</button>
                        <button onClick={() => setEditingId(null)} className="border border-mountain-mist px-4 py-1.5 rounded-lg text-body-sm">Cancel</button>
                    </div>
                </div>
            )}

            {days.length === 0 && !editingId ? (
                <p className="text-body-sm text-text-muted">No itinerary days added yet.</p>
            ) : (
                <div className="space-y-2">
                    {[...days].sort((a, b) => a.dayNumber - b.dayNumber).map((day) => (
                        <div key={day.id} className="flex items-center justify-between border-b border-mountain-mist pb-2">
                            <div>
                                <span className="font-semibold text-primary">Day {day.dayNumber}:</span> <span className="text-body-sm">{day.title}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(day)} className="text-secondary"><Pencil size={14} /></button>
                                <button onClick={() => handleDelete(day.id)} className="text-error"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
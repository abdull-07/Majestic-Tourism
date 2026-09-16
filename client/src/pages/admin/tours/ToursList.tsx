import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Compass } from 'lucide-react';
import { adminToursApi } from '../../../lib/api/admin-tours';
import type { AdminTour } from '../../../types/admin-tour';

export default function ToursList() {
    const [tours, setTours] = useState<AdminTour[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        adminToursApi.getAll().then(setTours).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await adminToursApi.remove(id);
            setTours((prev) => prev.filter((t) => t.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete tour');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-headline-sm text-primary">Tours</h1>
                    <p className="text-body-sm text-text-muted">Manage tour packages, itineraries, and availability</p>
                </div>
                <Link to="/admin/tours/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-body-sm hover:bg-primary-container transition-colors">
                    <Plus size={16} /> Add Tour
                </Link>
            </div>

            <div className="card overflow-hidden">
                {loading ? (
                    <p className="p-6 text-body-sm text-text-muted">Loading...</p>
                ) : tours.length === 0 ? (
                    <div className="p-10 text-center">
                        <Compass className="mx-auto text-mountain-mist mb-2" size={32} />
                        <p className="text-body-sm text-text-muted">No tours yet. Add your first one to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="bg-surface-container-low border-b border-mountain-mist text-left text-text-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Title</th>
                                <th className="px-4 py-3 font-medium">Destination</th>
                                <th className="px-4 py-3 font-medium">Category</th>
                                <th className="px-4 py-3 font-medium">Price</th>
                                <th className="px-4 py-3 font-medium">Bookings</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mountain-mist">
                            {tours.map((t) => (
                                <tr key={t.id} className="hover:bg-surface-container-low">
                                    <td className="px-4 py-3 font-medium text-on-surface">{t.title}</td>
                                    <td className="px-4 py-3 text-text-muted">{t.destination.name}</td>
                                    <td className="px-4 py-3 text-text-muted">{t.category}</td>
                                    <td className="px-4 py-3 text-secondary font-semibold">${Number(t.basePrice).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-text-muted">{t._count?.bookings ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full label ${t.isActive ? 'bg-primary-fixed text-primary' : 'bg-surface-container-high text-text-muted'}`}>
                                            {t.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/admin/tours/${t.id}/edit`} className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:opacity-90">
                                                <Pencil size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(t.id, t.title)}
                                                disabled={deletingId === t.id}
                                                className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
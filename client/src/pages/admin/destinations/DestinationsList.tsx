import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import { adminDestinationsApi } from '../../../lib/api/admin-destinations';
import type { Destination } from '../../../types/destination';

export default function DestinationsList() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadDestinations = async () => {
        setLoading(true);
        try {
            const data = await adminDestinationsApi.getAll();
            setDestinations(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load destinations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDestinations();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

        setDeletingId(id);
        try {
            await adminDestinationsApi.remove(id);
            setDestinations((prev) => prev.filter((d) => d.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete destination');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-headline-sm text-primary">Destinations</h1>
                    <p className="text-body-sm text-text-muted">Manage the regions your tours are grouped under</p>
                </div>
                <Link
                    to="/admin/destinations/new"
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-body-sm hover:bg-primary-container transition-colors"
                >
                    <Plus size={16} />
                    Add Destination
                </Link>
            </div>

            {error && (
                <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2 mb-4">{error}</p>
            )}

            <div className="card overflow-hidden">
                {loading ? (
                    <p className="p-6 text-body-sm text-text-muted">Loading...</p>
                ) : destinations.length === 0 ? (
                    <div className="p-10 text-center">
                        <MapPin className="mx-auto text-mountain-mist mb-2" size={32} />
                        <p className="text-body-sm text-text-muted">No destinations yet. Add your first one to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="bg-surface-container-low border-b border-mountain-mist text-left text-text-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Slug</th>
                                <th className="px-4 py-3 font-medium">Best Time to Visit</th>
                                <th className="px-4 py-3 font-medium">Tours</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mountain-mist">
                            {destinations.map((d) => (
                                <tr key={d.id} className="hover:bg-surface-container-low">
                                    <td className="px-4 py-3 font-medium text-on-surface">{d.name}</td>
                                    <td className="px-4 py-3 text-text-muted">{d.slug}</td>
                                    <td className="px-4 py-3 text-text-muted">{d.bestTimeToVisit || '—'}</td>
                                    <td className="px-4 py-3 text-text-muted">{d._count?.tours ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex px-2 py-0.5 rounded-full label ${d.isActive ? 'bg-primary-fixed text-primary' : 'bg-surface-container-high text-text-muted'
                                                }`}
                                        >
                                            {d.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/admin/destinations/${d.id}/edit`}
                                                className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:opacity-90"
                                            >
                                                <Pencil size={14} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(d.id, d.name)}
                                                disabled={deletingId === d.id}
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
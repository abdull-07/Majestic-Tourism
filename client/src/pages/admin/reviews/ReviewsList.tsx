import { useEffect, useState } from 'react';
import { Star, Trash2 } from 'lucide-react';
import { adminReviewsApi } from '../../../lib/api/admin-reviews';
import StatusBadge from '../../../components/admin/StatusBadge';
import type { AdminReview } from '../../../types/admin-review';

const statusFilters = ['PENDING', 'APPROVED', 'REJECTED', 'All'];

export default function ReviewsList() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [filter, setFilter] = useState('PENDING');
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        adminReviewsApi.getAll(filter === 'All' ? undefined : filter).then(setReviews).finally(() => setLoading(false));
    };

    useEffect(load, [filter]);

    const handleModerate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setActingId(id);
        try {
            await adminReviewsApi.moderate(id, status);
            load();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to moderate review');
        } finally {
            setActingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Permanently delete this review?')) return;
        setActingId(id);
        try {
            await adminReviewsApi.remove(id);
            load();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete review');
        } finally {
            setActingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-headline-sm text-primary">Reviews</h1>
                <p className="text-body-sm text-text-muted">Moderate customer reviews before they go live</p>
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

            {loading ? (
                <p className="text-body-sm text-text-muted">Loading...</p>
            ) : reviews.length === 0 ? (
                <div className="card p-10 text-center">
                    <Star className="mx-auto text-mountain-mist mb-2" size={32} />
                    <p className="text-body-sm text-text-muted">No reviews match this filter.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((r) => (
                        <div key={r.id} className="card p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <div className="flex items-center gap-1 mb-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} className={i < r.rating ? 'fill-tertiary text-tertiary' : 'text-mountain-mist'} />
                                        ))}
                                    </div>
                                    <p className="font-semibold text-primary text-body-sm">{r.user.fullName} <span className="text-text-muted font-normal">· {r.tour.title}</span></p>
                                    <p className="text-text-muted text-body-sm">{new Date(r.createdAt).toLocaleDateString()}</p>
                                </div>
                                <StatusBadge status={r.status} />
                            </div>

                            <p className="text-body-sm text-on-surface mb-4">{r.comment}</p>

                            {r.images.length > 0 && (
                                <div className="flex gap-2 mb-4">
                                    {r.images.map((img) => (
                                        <img key={img} src={img} alt="Review attachment" className="w-16 h-16 rounded-lg object-cover border border-mountain-mist" />
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                {r.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleModerate(r.id, 'APPROVED')}
                                            disabled={actingId === r.id}
                                            className="bg-primary text-white px-4 py-1.5 rounded-lg text-body-sm font-semibold disabled:opacity-50"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleModerate(r.id, 'REJECTED')}
                                            disabled={actingId === r.id}
                                            className="border border-error text-error px-4 py-1.5 rounded-lg text-body-sm font-semibold disabled:opacity-50"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => handleDelete(r.id)}
                                    disabled={actingId === r.id}
                                    className="ml-auto w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-colors disabled:opacity-50"
                                    title="Delete permanently"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
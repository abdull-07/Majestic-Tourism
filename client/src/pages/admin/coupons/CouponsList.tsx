import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { adminCouponsApi } from '../../../lib/api/admin-coupons';
import type { AdminCoupon } from '../../../types/admin-coupon';

export default function CouponsList() {
    const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        adminCouponsApi.getAll().then(setCoupons).finally(() => setLoading(false));
    };

    useEffect(load, []);

    const handleDelete = async (id: string, code: string) => {
        if (!window.confirm(`Delete coupon "${code}"?`)) return;
        setDeletingId(id);
        try {
            await adminCouponsApi.remove(id);
            setCoupons((prev) => prev.filter((c) => c.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete — try deactivating it instead if it has been used');
        } finally {
            setDeletingId(null);
        }
    };

    const isExpired = (validTo: string) => new Date(validTo) < new Date();

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-headline-sm text-primary">Coupons</h1>
                    <p className="text-body-sm text-text-muted">Discount codes customers can apply at booking</p>
                </div>
                <Link to="/admin/coupons/new" className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl font-semibold text-body-sm hover:bg-primary-container transition-colors">
                    <Plus size={16} /> Add Coupon
                </Link>
            </div>

            <div className="card overflow-hidden">
                {loading ? (
                    <p className="p-6 text-body-sm text-text-muted">Loading...</p>
                ) : coupons.length === 0 ? (
                    <div className="p-10 text-center">
                        <Tag className="mx-auto text-mountain-mist mb-2" size={32} />
                        <p className="text-body-sm text-text-muted">No coupons yet. Add your first one to get started.</p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="bg-surface-container-low border-b border-mountain-mist text-left text-text-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Code</th>
                                <th className="px-4 py-3 font-medium">Discount</th>
                                <th className="px-4 py-3 font-medium">Usage</th>
                                <th className="px-4 py-3 font-medium">Valid Until</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mountain-mist">
                            {coupons.map((c) => {
                                const expired = isExpired(c.validTo);
                                return (
                                    <tr key={c.id} className="hover:bg-surface-container-low">
                                        <td className="px-4 py-3 font-mono font-semibold text-primary">{c.code}</td>
                                        <td className="px-4 py-3 text-on-surface">
                                            {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `$${c.discountValue}`}
                                            {c.minAmount && <span className="text-text-muted"> (min ${c.minAmount})</span>}
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">
                                            {c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ' (unlimited)'}
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">{new Date(c.validTo).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full label ${!c.isActive ? 'bg-surface-container-high text-text-muted' :
                                                    expired ? 'bg-error-container text-error' : 'bg-primary-fixed text-primary'
                                                }`}>
                                                {!c.isActive ? 'Inactive' : expired ? 'Expired' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link to={`/admin/coupons/${c.id}/edit`} className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:opacity-90">
                                                    <Pencil size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(c.id, c.code)}
                                                    disabled={deletingId === c.id}
                                                    className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center hover:opacity-90 disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
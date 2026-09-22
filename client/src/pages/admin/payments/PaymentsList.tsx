import { useEffect, useState } from 'react';
import { CreditCard, Eye } from 'lucide-react';
import { adminPaymentsApi } from '../../../lib/api/admin-payments';
import StatusBadge from '../../../components/admin/StatusBadge';
import type { AdminPaymentListItem } from '../../../types/admin-payment';

const statusFilters = ['All', 'PENDING', 'VERIFIED', 'FAILED', 'REFUNDED'];

export default function PaymentsList() {
    const [payments, setPayments] = useState<AdminPaymentListItem[]>([]);
    const [filter, setFilter] = useState('PENDING'); // default to what needs action
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState<string | null>(null);

    const load = () => {
        setLoading(true);
        adminPaymentsApi.getAll(filter === 'All' ? undefined : filter).then(setPayments).finally(() => setLoading(false));
    };

    useEffect(load, [filter]);

    const handleVerify = async (id: string) => {
        setActingId(id);
        try {
            await adminPaymentsApi.verify(id);
            load();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to verify payment');
        } finally {
            setActingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm('Reject this payment? The customer will need to submit a new one.')) return;
        setActingId(id);
        try {
            await adminPaymentsApi.reject(id);
            load();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to reject payment');
        } finally {
            setActingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-headline-sm text-primary">Payments</h1>
                <p className="text-body-sm text-text-muted">Verify or reject submitted payments</p>
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

            <div className="card overflow-hidden">
                {loading ? (
                    <p className="p-6 text-body-sm text-text-muted">Loading...</p>
                ) : payments.length === 0 ? (
                    <div className="p-10 text-center">
                        <CreditCard className="mx-auto text-mountain-mist mb-2" size={32} />
                        <p className="text-body-sm text-text-muted">No payments match this filter.</p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="bg-surface-container-low border-b border-mountain-mist text-left text-text-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Booking #</th>
                                <th className="px-4 py-3 font-medium">Customer</th>
                                <th className="px-4 py-3 font-medium">Method</th>
                                <th className="px-4 py-3 font-medium">Amount</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mountain-mist">
                            {payments.map((p) => (
                                <tr key={p.id} className="hover:bg-surface-container-low">
                                    <td className="px-4 py-3 font-medium text-primary">{p.booking.bookingNumber}</td>
                                    <td className="px-4 py-3 text-text-muted">{p.booking.guestName || '—'}</td>
                                    <td className="px-4 py-3 text-on-surface">{p.method}</td>
                                    <td className="px-4 py-3 text-secondary font-semibold">${Number(p.amount).toLocaleString()}</td>
                                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                                    <td className="px-4 py-3 text-text-muted">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        {p.status === 'PENDING' ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleVerify(p.id)}
                                                    disabled={actingId === p.id}
                                                    className="bg-primary text-white px-3 py-1.5 rounded-lg text-body-sm font-semibold disabled:opacity-50"
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    onClick={() => handleReject(p.id)}
                                                    disabled={actingId === p.id}
                                                    className="border border-error text-error px-3 py-1.5 rounded-lg text-body-sm font-semibold disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end">
                                                <Eye size={16} className="text-text-muted" />
                                            </div>
                                        )}
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
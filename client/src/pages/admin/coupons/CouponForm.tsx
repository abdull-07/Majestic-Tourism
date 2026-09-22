import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminCouponsApi } from '../../../lib/api/admin-coupons';
import type { CouponFormValues } from '../../../types/admin-coupon';

const emptyForm: CouponFormValues = {
    code: '', discountType: 'PERCENTAGE', discountValue: 10, minAmount: null, maxUses: null,
    validFrom: '', validTo: '', isActive: true,
};

export default function CouponForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState<CouponFormValues>(emptyForm);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        adminCouponsApi
            .getOne(id)
            .then((data) =>
                setForm({
                    code: data.code,
                    discountType: data.discountType,
                    discountValue: data.discountValue,
                    minAmount: data.minAmount,
                    maxUses: data.maxUses,
                    validFrom: data.validFrom.slice(0, 10),
                    validTo: data.validTo.slice(0, 10),
                    isActive: data.isActive,
                }),
            )
            .catch(() => setError('Failed to load coupon'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = <K extends keyof CouponFormValues>(field: K, value: CouponFormValues[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (isEditMode && id) {
                await adminCouponsApi.update(id, form);
            } else {
                await adminCouponsApi.create(form);
            }
            navigate('/admin/coupons');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save coupon');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-body-sm text-text-muted">Loading...</p>;

    return (
        <div className="max-w-xl">
            <button onClick={() => navigate('/admin/coupons')} className="flex items-center gap-1 text-body-sm text-text-muted hover:text-primary mb-4">
                <ArrowLeft size={14} /> Back to Coupons
            </button>

            <h1 className="text-headline-sm text-primary mb-6">{isEditMode ? 'Edit Coupon' : 'Add Coupon'}</h1>

            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <div>
                    <label className="label text-primary mb-2 block">Code</label>
                    <input
                        type="text" required value={form.code}
                        onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md font-mono focus:outline-none focus:border-secondary"
                        placeholder="WELCOME10"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label text-primary mb-2 block">Discount Type</label>
                        <select
                            value={form.discountType}
                            onChange={(e) => handleChange('discountType', e.target.value as 'PERCENTAGE' | 'FIXED')}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md"
                        >
                            <option value="PERCENTAGE">Percentage (%)</option>
                            <option value="FIXED">Fixed Amount ($)</option>
                        </select>
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">
                            Value {form.discountType === 'PERCENTAGE' ? '(%)' : '($)'}
                        </label>
                        <input
                            type="number" min={0} required value={form.discountValue}
                            onChange={(e) => handleChange('discountValue', Number(e.target.value))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label text-primary mb-2 block">Min Booking Amount (optional)</label>
                        <input
                            type="number" min={0} value={form.minAmount ?? ''}
                            onChange={(e) => handleChange('minAmount', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md"
                            placeholder="No minimum"
                        />
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">Max Uses (optional)</label>
                        <input
                            type="number" min={1} value={form.maxUses ?? ''}
                            onChange={(e) => handleChange('maxUses', e.target.value ? Number(e.target.value) : null)}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md"
                            placeholder="Unlimited"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="label text-primary mb-2 block">Valid From</label>
                        <input
                            type="date" required value={form.validFrom}
                            onChange={(e) => handleChange('validFrom', e.target.value)}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md"
                        />
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">Valid To</label>
                        <input
                            type="date" required value={form.validTo}
                            onChange={(e) => handleChange('validTo', e.target.value)}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md"
                        />
                    </div>
                </div>

                <label className="flex items-center gap-2 text-body-sm">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="rounded border-mountain-mist" />
                    Active
                </label>

                {error && <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{error}</p>}

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition-colors disabled:opacity-50">
                        {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Coupon'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/coupons')} className="border border-mountain-mist text-on-surface px-6 py-2.5 rounded-xl font-semibold hover:bg-surface-container-low transition-colors">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
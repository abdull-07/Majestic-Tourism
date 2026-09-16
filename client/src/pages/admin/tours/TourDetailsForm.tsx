import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminToursApi } from '../../../lib/api/admin-tours';
import { adminDestinationsApi } from '../../../lib/api/admin-destinations';
import type { TourFormValues } from '../../../types/admin-tour';
import type { Destination } from '../../../types/destination';

const emptyForm: TourFormValues = {
    title: '', description: '', destinationId: '', category: 'ADVENTURE', difficultyLevel: 'EASY',
    durationDays: 1, durationNights: 0, minGroupSize: 1, maxGroupSize: 10,
    basePrice: 0, childPrice: null, inclusions: [], exclusions: [], isFeatured: false, isActive: true,
};

type Props = {
    tourId?: string;
    initialValues?: TourFormValues;
    onSaved?: () => void;
};

export default function TourDetailsForm({ tourId, initialValues, onSaved }: Props) {
    const navigate = useNavigate();
    const isEditMode = Boolean(tourId);

    const [form, setForm] = useState<TourFormValues>(initialValues || emptyForm);
    const [inclusionsText, setInclusionsText] = useState(initialValues?.inclusions?.join('\n') || '');
    const [exclusionsText, setExclusionsText] = useState(initialValues?.exclusions?.join('\n') || '');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        adminDestinationsApi.getAll().then(setDestinations).catch(() => { });
    }, []);

    useEffect(() => {
        if (initialValues) {
            setForm(initialValues);
            setInclusionsText(initialValues.inclusions?.join('\n') || '');
            setExclusionsText(initialValues.exclusions?.join('\n') || '');
        }
    }, [initialValues]);

    const handleChange = <K extends keyof TourFormValues>(field: K, value: TourFormValues[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        const payload: TourFormValues = {
            ...form,
            inclusions: inclusionsText.split('\n').map((item) => item.trim()).filter(Boolean),
            exclusions: exclusionsText.split('\n').map((item) => item.trim()).filter(Boolean),
        };

        try {
            if (isEditMode && tourId) {
                await adminToursApi.update(tourId, payload);
                onSaved?.();
            } else {
                const created = await adminToursApi.create(payload);
                navigate(`/admin/tours/${created.id}/edit`);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save tour');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
            <div>
                <label className="label text-primary mb-2 block">Title</label>
                <input type="text" required value={form.title} onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary" placeholder="e.g. Hunza Valley Explorer" />
            </div>

            <div>
                <label className="label text-primary mb-2 block">Description</label>
                <textarea required minLength={20} rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label text-primary mb-2 block">Destination</label>
                    <select required value={form.destinationId} onChange={(e) => handleChange('destinationId', e.target.value)}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md">
                        <option value="">Select destination</option>
                        {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="label text-primary mb-2 block">Category</label>
                    <select value={form.category} onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md">
                        {['FAMILY', 'HONEYMOON', 'GROUP', 'ADVENTURE', 'BUDGET', 'LUXURY'].map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label text-primary mb-2 block">Difficulty</label>
                    <select value={form.difficultyLevel} onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md">
                        {['EASY', 'MODERATE', 'CHALLENGING'].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="label text-primary mb-2 block">Days</label>
                        <input type="number" min={1} required value={form.durationDays} onChange={(e) => handleChange('durationDays', Number(e.target.value))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">Nights</label>
                        <input type="number" min={0} required value={form.durationNights} onChange={(e) => handleChange('durationNights', Number(e.target.value))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label text-primary mb-2 block">Min Group Size</label>
                    <input type="number" min={1} required value={form.minGroupSize} onChange={(e) => handleChange('minGroupSize', Number(e.target.value))}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                </div>
                <div>
                    <label className="label text-primary mb-2 block">Max Group Size</label>
                    <input type="number" min={1} required value={form.maxGroupSize} onChange={(e) => handleChange('maxGroupSize', Number(e.target.value))}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="label text-primary mb-2 block">Base Price (per adult)</label>
                    <input type="number" min={0} step="0.01" required value={form.basePrice} onChange={(e) => handleChange('basePrice', Number(e.target.value))}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                </div>
                <div>
                    <label className="label text-primary mb-2 block">Child Price (optional)</label>
                    <input type="number" min={0} step="0.01" value={form.childPrice ?? ''} onChange={(e) => handleChange('childPrice', e.target.value ? Number(e.target.value) : null)}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" placeholder="Same as adult if blank" />
                </div>
            </div>

            <div>
                <label className="label text-primary mb-2 block">Inclusions (one per line)</label>
                <textarea rows={3} value={inclusionsText} onChange={(e) => setInclusionsText(e.target.value)}
                    className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary" placeholder="Hotel accommodation&#10;All meals&#10;Local transport" />
            </div>

            <div>
                <label className="label text-primary mb-2 block">Exclusions (one per line)</label>
                <textarea rows={3} value={exclusionsText} onChange={(e) => setExclusionsText(e.target.value)}
                    className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary" placeholder="Flights&#10;Travel insurance" />
            </div>

            <div className="flex gap-6">
                <label className="flex items-center gap-2 text-body-sm">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} className="rounded border-mountain-mist" />
                    Featured
                </label>
                <label className="flex items-center gap-2 text-body-sm">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} className="rounded border-mountain-mist" />
                    Active
                </label>
            </div>

            {error && <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={saving} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Tour & Continue'}
            </button>
        </form>
    );
}
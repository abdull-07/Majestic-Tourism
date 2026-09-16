import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { adminDestinationsApi, type DestinationFormValues } from '../../../lib/api/admin-destinations';

const emptyForm: DestinationFormValues = {
    name: '',
    description: '',
    coverImage: '',
    bestTimeToVisit: '',
    isActive: true,
};

export default function DestinationForm() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState<DestinationFormValues>(emptyForm);
    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;
        adminDestinationsApi
            .getOne(id)
            .then((data) =>
                setForm({
                    name: data.name,
                    description: data.description,
                    coverImage: data.coverImage || '',
                    bestTimeToVisit: data.bestTimeToVisit || '',
                        isActive: data.isActive,
                }),
            )
            .catch(() => setError('Failed to load destination'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleChange = (field: keyof DestinationFormValues, value: string | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            if (isEditMode && id) {
                await adminDestinationsApi.update(id, form);
            } else {
                await adminDestinationsApi.create(form);
            }
            navigate('/admin/destinations');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save destination');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p className="text-body-sm text-text-muted">Loading...</p>;

    return (
        <div className="max-w-2xl">
            <button
                onClick={() => navigate('/admin/destinations')}
                className="flex items-center gap-1 text-body-sm text-text-muted hover:text-primary mb-4"
            >
                <ArrowLeft size={14} />
                Back to Destinations
            </button>

            <h1 className="text-headline-sm text-primary mb-6">
                {isEditMode ? 'Edit Destination' : 'Add Destination'}
            </h1>

            <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <div>
                    <label className="label text-primary mb-2 block">Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                        placeholder="e.g. Hunza Valley"
                    />
                    {isEditMode && (
                        <p className="text-body-sm text-text-muted mt-1">Changing the name does not update the existing slug.</p>
                    )}
                </div>

                <div>
                    <label className="label text-primary mb-2 block">Description</label>
                    <textarea
                        value={form.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        required
                        minLength={20}
                        rows={4}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                        placeholder="A short overview of the region..."
                    />
                </div>

                <div>
                    <label className="label text-primary mb-2 block">Cover Image URL</label>
                    <input
                        type="text"
                        value={form.coverImage}
                        onChange={(e) => handleChange('coverImage', e.target.value)}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                        placeholder="https://..."
                    />
                    <p className="text-body-sm text-text-muted mt-1">
                        Paste a Cloudinary URL from the media upload endpoint, or any hosted image URL for now.
                    </p>
                </div>

                <div>
                    <label className="label text-primary mb-2 block">Best Time to Visit</label>
                    <input
                        type="text"
                        value={form.bestTimeToVisit}
                        onChange={(e) => handleChange('bestTimeToVisit', e.target.value)}
                        className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                        placeholder="e.g. April to October"
                    />
                </div>

                <label className="flex items-center gap-2 text-body-sm text-on-surface">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                        className="rounded border-mountain-mist"
                    />
                    Active (visible on the public site)
                </label>

                {error && (
                    <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Destination'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/destinations')}
                        className="border border-mountain-mist text-on-surface px-6 py-2.5 rounded-xl font-semibold hover:bg-surface-container-low transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
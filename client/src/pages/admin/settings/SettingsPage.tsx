import { useEffect, useState } from 'react';
import { adminSettingsApi } from '../../../lib/api/admin-settings';

const FIELD_GROUPS = [
    {
        title: 'Contact Information',
        fields: [
            { key: 'contact_phone', label: 'Phone Number', placeholder: '+92 300 1234567' },
            { key: 'whatsapp_number', label: 'WhatsApp Number', placeholder: '+923001234567 (used by the storefront chat button)' },
            { key: 'contact_email', label: 'Email Address', placeholder: 'hello@majestictourism.com' },
            { key: 'contact_address', label: 'Office Address', placeholder: 'Islamabad, Pakistan' },
        ],
    },
    {
        title: 'Social Links',
        fields: [
            { key: 'social_facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
            { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
        ],
    },
    {
        title: 'SEO Defaults',
        fields: [
            { key: 'seo_default_title', label: 'Default Meta Title', placeholder: 'Majestic Tourism — Northern Pakistan Adventures' },
            { key: 'seo_default_description', label: 'Default Meta Description', placeholder: 'Used for pages without their own SEO fields set' },
        ],
    },
];

export default function SettingsPage() {
    const [values, setValues] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [savedKey, setSavedKey] = useState<string | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        adminSettingsApi
            .getAll()
            .then((rows) => {
                const map: Record<string, string> = {};
                rows.forEach((r) => { map[r.key] = r.value; });
                setValues(map);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (key: string, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async (key: string) => {
        setError('');
        setSavingKey(key);
        try {
            await adminSettingsApi.upsert(key, values[key] || '');
            setSavedKey(key);
            setTimeout(() => setSavedKey(null), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || `Failed to save ${key}`);
        } finally {
            setSavingKey(null);
        }
    };

    if (loading) return <p className="text-body-sm text-text-muted">Loading settings...</p>;

    return (
        <div className="max-w-2xl">
            <h1 className="text-headline-sm text-primary mb-1">Site Settings</h1>
            <p className="text-body-sm text-text-muted mb-6">
                Contact info, social links, and SEO defaults used across the public site.
            </p>

            {error && <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <div className="space-y-6">
                {FIELD_GROUPS.map((group) => (
                    <div key={group.title} className="card p-6">
                        <h3 className="font-semibold text-primary mb-4">{group.title}</h3>
                        <div className="space-y-4">
                            {group.fields.map((field) => (
                                <div key={field.key}>
                                    <label className="label text-primary mb-2 block">{field.label}</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={values[field.key] || ''}
                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                            placeholder={field.placeholder}
                                            className="flex-1 border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                                        />
                                        <button
                                            onClick={() => handleSave(field.key)}
                                            disabled={savingKey === field.key}
                                            className={`px-4 py-2.5 rounded-lg text-body-sm font-semibold transition-colors disabled:opacity-50 ${savedKey === field.key ? 'bg-primary-fixed text-primary' : 'bg-primary text-white hover:bg-primary-container'
                                                }`}
                                        >
                                            {savingKey === field.key ? 'Saving...' : savedKey === field.key ? 'Saved ✓' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { mediaApi } from '../../lib/api/media';

type Props = {
    label: string;
    value: string;
    onChange: (url: string) => void;
    folder: string;
};

export default function ImageUploadField({ label, value, onChange, folder }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setUploading(true);

        try {
            const result = await mediaApi.upload(file, folder);
            onChange(result.url);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Upload failed — please try again');
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = ''; // allow re-selecting the same file
        }
    };

    return (
        <div>
            <label className="label text-primary mb-2 block">{label}</label>

            {value ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-mountain-mist group">
                    <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-48 rounded-lg border-2 border-dashed border-mountain-mist flex flex-col items-center justify-center gap-2 text-text-muted hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50"
                >
                    {uploading ? (
                        <>
                            <Loader2 size={24} className="animate-spin" />
                            <span className="text-body-sm">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <Upload size={24} />
                            <span className="text-body-sm">Click to upload an image</span>
                            <span className="text-body-sm opacity-60">JPEG, PNG, or WebP — max 5MB</span>
                        </>
                    )}
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            {error && <p className="text-body-sm text-error mt-2">{error}</p>}
        </div>
    );
}
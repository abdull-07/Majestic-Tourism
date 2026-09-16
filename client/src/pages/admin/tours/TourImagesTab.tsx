import { Star, Trash2 } from 'lucide-react';
import { mediaApi } from '../../../lib/api/media';
import { adminToursApi } from '../../../lib/api/admin-tours';
import type { AdminTourImage } from '../../../types/admin-tour';

type Props = { tourId: string; images: AdminTourImage[]; onChange: () => void };

export default function TourImagesTab({ tourId, images, onChange }: Props) {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const result = await mediaApi.upload(file, 'tours');
        await adminToursApi.addImage(tourId, result.url, result.publicId, images.length === 0);
        onChange();
        e.target.value = '';
    };

    return (
        <div className="card p-6">
            <h3 className="font-semibold text-primary mb-4">Tour Images</h3>

            <label className="inline-block bg-primary text-white px-4 py-2 rounded-lg text-body-sm font-semibold cursor-pointer hover:bg-primary-container transition-colors mb-6">
                Upload Image
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
            </label>

            {images.length === 0 ? (
                <p className="text-body-sm text-text-muted">No images uploaded yet.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                        <div key={img.id} className="relative rounded-lg overflow-hidden border border-mountain-mist group h-40">
                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                            {img.isCover && (
                                <span className="absolute top-2 left-2 bg-tertiary text-white label px-2 py-0.5 rounded-full">Cover</span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {!img.isCover && (
                                    <button onClick={async () => { await adminToursApi.setCoverImage(img.id); onChange(); }}
                                        className="w-8 h-8 rounded-full bg-white text-tertiary flex items-center justify-center" title="Set as cover">
                                        <Star size={14} />
                                    </button>
                                )}
                                <button onClick={async () => { await adminToursApi.removeImage(img.id); onChange(); }}
                                    className="w-8 h-8 rounded-full bg-white text-error flex items-center justify-center" title="Delete">
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
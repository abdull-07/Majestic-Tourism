import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useWishlistStore } from '../store/useWishlistStore';


type Props = { tourId: string; className?: string };

export default function WishlistButton({ tourId, className = '' }: Props) {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const { ids, loaded, load, add, remove } = useWishlistStore();
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        if (user && !loaded) load().catch(() => { });
    }, [user, loaded, load]);

    const saved = ids.includes(tourId);

    const handleClick = async (e: MouseEvent) => {
        // This button sits inside card links — don't navigate to the tour page
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            navigate('/login');
            return;
        }

        setBusy(true);
        try {
            if (saved) await remove(tourId);
            else await add(tourId);
        } catch {
            // state only changes on success, so there's nothing to roll back
        } finally {
            setBusy(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={busy}
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform disabled:opacity-60 ${className}`}
        >
            <Heart size={18} className={saved ? 'fill-error text-error' : 'text-on-surface-variant'} />
        </button>
    );
}
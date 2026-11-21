import { create } from 'zustand';
import { wishlistApi } from '../lib/api/wishlist';
import { useAuthStore } from './useAuthStore';

type WishlistState = {
    ids: string[];
    loaded: boolean;
    loading: boolean;
    load: () => Promise<void>;
    add: (tourId: string) => Promise<void>;
    remove: (tourId: string) => Promise<void>;
    clear: () => void;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
    ids: [],
    loaded: false,
    loading: false,

    load: async () => {
        // Many hearts can mount at once (tour listing) — only fetch once
        if (get().loaded || get().loading) return;
        set({ loading: true });
        try {
            const items = await wishlistApi.getAll();
            set({ ids: items.map((i) => i.tourId), loaded: true });
        } finally {
            set({ loading: false });
        }
    },

    add: async (tourId) => {
        try {
            await wishlistApi.add(tourId);
        } catch (err: any) {
            if (err.response?.status !== 409) throw err; // 409 = already saved, treat as success
        }
        if (!get().ids.includes(tourId)) set({ ids: [...get().ids, tourId] });
    },

    remove: async (tourId) => {
        await wishlistApi.remove(tourId);
        set({ ids: get().ids.filter((id) => id !== tourId) });
    },

    clear: () => set({ ids: [], loaded: false }),
}));

// Reset on logout so the next account doesn't inherit someone else's hearts
useAuthStore.subscribe((state, prev) => {
    if (prev.user && !state.user) useWishlistStore.getState().clear();
});
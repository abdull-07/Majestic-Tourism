import api from '../api';
import type { WishlistItem } from '../../types/wishlist';

export const wishlistApi = {
  getAll: () => api.get<WishlistItem[]>('/wishlist').then((r) => r.data),
  add: (tourId: string) => api.post('/wishlist', { tourId }).then((r) => r.data),
  remove: (tourId: string) => api.delete(`/wishlist/${tourId}`).then((r) => r.data),
};
import api from '../api';
import type { Tour, TourDetail } from '../../types/tour';

export const toursApi = {
    getAllActive: (filters: { destinationId?: string; category?: string } = {}) =>
        api.get<Tour[]>('/tours', { params: filters }).then((r) => r.data),
    getBySlug: (slug: string) => api.get<TourDetail>(`/tours/${slug}`).then((r) => r.data),
};
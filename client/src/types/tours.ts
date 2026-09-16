import api from '../lib/api';
import type { Tour } from './tour';

export const toursApi = {
    getAllActive: (filters: { destinationId?: string; category?: string } = {}) =>
        api
            .get<Tour[]>('/tours', { params: filters })
            .then((r) => r.data),
    getBySlug: (slug: string) => api.get(`/tours/${slug}`).then((r) => r.data),
};
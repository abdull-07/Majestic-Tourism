import api from '../api';
import type { Destination, DestinationDetail } from '../../types/destination';

export const destinationsApi = {
    getAllActive: () => api.get<Destination[]>('/destinations').then((r) => r.data),
    getBySlug: (slug: string) => api.get<DestinationDetail>(`/destinations/${slug}`).then((r) => r.data),
};
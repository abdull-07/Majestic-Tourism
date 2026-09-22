import api from '../api';
import type { Destination } from '../../types/destination';

export interface DestinationFormValues {
    name: string;
    description: string;
    coverImage: string;
    bestTimeToVisit: string;
    isActive: boolean;
}

export const adminDestinationsApi = {
    getAll: () => api.get<Destination[]>('/admin/destinations').then((r) => r.data),
    getOne: (id: string) => api.get<Destination>(`/admin/destinations/${id}`).then((r) => r.data),
    create: (data: DestinationFormValues) =>
        api.post<Destination>('/admin/destinations', data).then((r) => r.data),
    update: (id: string, data: Partial<DestinationFormValues>) =>
        api.patch<Destination>(`/admin/destinations/${id}`, data).then((r) => r.data),
    remove: (id: string) => api.delete(`/admin/destinations/${id}`),
};
import api from '../api';
import type { AdminReview } from '../../types/admin-review';

export const adminReviewsApi = {
    getAll: (status?: string) =>
        api.get<AdminReview[]>('/admin/reviews', { params: status ? { status } : {} }).then((r) => r.data),
    moderate: (id: string, status: 'APPROVED' | 'REJECTED') =>
        api.patch(`/admin/reviews/${id}/moderate`, { status }).then((r) => r.data),
    remove: (id: string) => api.delete(`/admin/reviews/${id}`),
};
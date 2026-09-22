import api from '../api';
import type { AdminPaymentListItem, AdminPaymentDetail } from '../../types/admin-payment';

export const adminPaymentsApi = {
    getAll: (status?: string) =>
        api.get<AdminPaymentListItem[]>('/admin/payments', { params: status ? { status } : {} }).then((r) => r.data),
    getOne: (id: string) => api.get<AdminPaymentDetail>(`/admin/payments/${id}`).then((r) => r.data),
    verify: (id: string) => api.patch(`/admin/payments/${id}/verify`).then((r) => r.data),
    reject: (id: string) => api.patch(`/admin/payments/${id}/reject`).then((r) => r.data),
};
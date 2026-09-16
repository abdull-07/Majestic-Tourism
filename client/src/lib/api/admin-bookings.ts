import api from '../api';
import type { AdminBookingListItem, AdminBookingDetail } from '../../types/admin-booking';

export const adminBookingsApi = {
  getAll: (status?: string) =>
    api.get<AdminBookingListItem[]>('/admin/bookings', { params: status ? { status } : {} }).then((r) => r.data),
  getOne: (id: string) => api.get<AdminBookingDetail>(`/admin/bookings/${id}`).then((r) => r.data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/admin/bookings/${id}/status`, { status }).then((r) => r.data),
};
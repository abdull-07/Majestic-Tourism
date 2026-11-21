import api from '../api';
import type { AccountBooking, AccountBookingDetail, AccountProfile } from '../../types/account';

export const accountApi = {
    getBookings: () => api.get<AccountBooking[]>('/account/bookings').then((r) => r.data),
    getBooking: (id: string) => api.get<AccountBookingDetail>(`/account/bookings/${id}`).then((r) => r.data),

    getProfile: () => api.get<AccountProfile>('/account/profile').then((r) => r.data),
    updateProfile: (data: { fullName?: string; phone?: string }) =>
        api.patch<AccountProfile>('/account/profile', data).then((r) => r.data),
    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.patch('/account/password', data).then((r) => r.data),
};
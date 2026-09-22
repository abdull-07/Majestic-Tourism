import api from '../api';
import type { AdminCoupon, CouponFormValues } from '../../types/admin-coupon';

export const adminCouponsApi = {
    getAll: () => api.get<AdminCoupon[]>('/admin/coupons').then((r) => r.data),
    getOne: (id: string) => api.get<AdminCoupon>(`/admin/coupons/${id}`).then((r) => r.data),
    create: (data: CouponFormValues) => api.post<AdminCoupon>('/admin/coupons', data).then((r) => r.data),
    update: (id: string, data: Partial<CouponFormValues>) =>
        api.patch<AdminCoupon>(`/admin/coupons/${id}`, data).then((r) => r.data),
    remove: (id: string) => api.delete(`/admin/coupons/${id}`),
};
import api from '../api';
import type { AdminUser } from '../../types/admin-user';

export const adminUsersApi = {
    getAll: (role?: string) =>
        api.get<AdminUser[]>('/admin/users', { params: role ? { role } : {} }).then((r) => r.data),
    getOne: (id: string) => api.get<AdminUser>(`/admin/users/${id}`).then((r) => r.data),
    updateRole: (id: string, role: string) =>
        api.patch(`/admin/users/${id}/role`, { role }).then((r) => r.data),
    updateStatus: (id: string, isActive: boolean) =>
        api.patch(`/admin/users/${id}/status`, { isActive }).then((r) => r.data),
};
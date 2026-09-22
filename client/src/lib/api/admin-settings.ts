import api from '../api';

export interface AdminSetting {
    id: string;
    key: string;
    value: string;
}

export const adminSettingsApi = {
    getAll: () => api.get<AdminSetting[]>('/admin/settings').then((r) => r.data),
    upsert: (key: string, value: string) => api.put(`/admin/settings/${key}`, { value }).then((r) => r.data),
};
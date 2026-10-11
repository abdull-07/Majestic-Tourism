import api from '../api';
import type { AdminBlogPost, BlogPostFormValues } from '../../types/admin-blog';

export const adminBlogApi = {
    getAll: () => api.get<AdminBlogPost[]>('/admin/blog').then((r) => r.data),
    getOne: (id: string) => api.get<AdminBlogPost>(`/admin/blog/${id}`).then((r) => r.data),
    create: (data: BlogPostFormValues) => api.post<AdminBlogPost>('/admin/blog', data).then((r) => r.data),
    update: (id: string, data: Partial<BlogPostFormValues>) =>
        api.patch<AdminBlogPost>(`/admin/blog/${id}`, data).then((r) => r.data),
    remove: (id: string) => api.delete(`/admin/blog/${id}`),
};
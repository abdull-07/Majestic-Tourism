import api from '../api';

export const authApi = {
    register: (data: { fullName: string; email: string; password: string; phone?: string }) =>
        api.post('/auth/register', data).then((r) => r.data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data).then((r) => r.data),
    verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`).then((r) => r.data),
    resendVerification: () => api.post('/auth/resend-verification').then((r) => r.data),
};
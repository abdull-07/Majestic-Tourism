export interface AdminUser {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    role: 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    _count?: { bookings: number; reviews: number };
}
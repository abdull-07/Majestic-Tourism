import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';

type User = {
    id: string;
    email: string;
    fullName?: string;
    role: Role;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    setSession: (user: User, accessToken: string, refreshToken: string) => void;
    setTokens: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            setSession: (user, accessToken, refreshToken) => set({ user, accessToken, refreshToken }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            logout: () => set({ user: null, accessToken: null, refreshToken: null }),
        }),
        { name: 'majestic-auth' },
    ),
);
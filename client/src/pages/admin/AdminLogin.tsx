import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function AdminLogin() {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/login', { email, password });

            if (!['ADMIN', 'SUPER_ADMIN', 'STAFF'].includes(data.user.role)) {
                setError('This account does not have admin access.');
                setLoading(false);
                return;
            }

            setSession(data.user, data.accessToken, data.refreshToken);
            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface-container-low px-6">
            <div className="w-full max-w-sm card p-8">
                <h1 className="text-headline-sm text-primary mb-1">Majestic Tourism</h1>
                <p className="text-text-muted text-body-sm mb-6">Admin Panel Login</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label text-primary mb-2 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                            placeholder="admin@majestictourism.com"
                        />
                    </div>

                    <div>
                        <label className="label text-primary mb-2 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-container transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
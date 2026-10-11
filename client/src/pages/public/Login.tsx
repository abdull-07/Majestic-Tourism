import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../lib/api/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authApi.login(form);
            setSession(data.user, data.accessToken, data.refreshToken);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24">
            <div className="w-full max-w-sm card p-8">
                <h1 className="text-headline-sm text-primary mb-1">Welcome Back</h1>
                <p className="text-text-muted text-body-sm mb-6">Log in to manage your bookings</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label text-primary mb-2 block">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">Password</label>
                        <input type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                    {error && <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50">
                        {loading ? 'Signing in...' : 'Log In'}
                    </button>
                </form>

                <p className="text-body-sm text-text-muted text-center mt-6">
                    Don't have an account? <Link to="/register" className="text-secondary font-semibold">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
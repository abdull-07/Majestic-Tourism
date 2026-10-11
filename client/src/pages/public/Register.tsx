import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../lib/api/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function Register() {
    const setSession = useAuthStore((s) => s.setSession);
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authApi.register(form);
            setSession(data.user, data.accessToken, data.refreshToken);
            setSubmitted(true); // show confirmation screen instead of redirecting to a dashboard
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6 py-24 text-center">
                <div className="max-w-md">
                    <h1 className="text-headline-sm text-primary mb-4">Check Your Email</h1>
                    <p className="text-text-muted text-body-md mb-8">
                        We've sent a verification link to <strong>{form.email}</strong>. Click it to
                        verify your account — you can still browse and book in the meantime.
                    </p>
                    <Link to="/" className="bg-primary text-white px-6 py-3 rounded-xl font-bold inline-block">
                        Continue to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24">
            <div className="w-full max-w-sm card p-8">
                <h1 className="text-headline-sm text-primary mb-1">Create an Account</h1>
                <p className="text-text-muted text-body-sm mb-6">Book faster and track your trips</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label text-primary mb-2 block">Full Name</label>
                        <input type="text" required value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                    <div>
                        <label className="label text-primary mb-2 block">Password</label>
                        <input type="password" required minLength={8} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            className="w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md" />
                    </div>
                    {error && <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2">{error}</p>}
                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-xl font-bold disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-body-sm text-text-muted text-center mt-6">
                    Already have an account? <Link to="/login" className="text-secondary font-semibold">Log In</Link>
                </p>
            </div>
        </div>
    );
}
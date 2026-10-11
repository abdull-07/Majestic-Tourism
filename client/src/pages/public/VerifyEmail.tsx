import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { authApi } from '../../lib/api/auth';

export default function VerifyEmail() {
    const { token } = useParams<{ token: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) return;
        authApi
            .verifyEmail(token)
            .then(() => setStatus('success'))
            .catch((err) => {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed');
            });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24 text-center">
            <div className="max-w-md">
                {status === 'loading' && <p className="text-text-muted">Verifying your email...</p>}
                {status === 'success' && (
                    <>
                        <h1 className="text-headline-sm text-primary mb-4">Email Verified</h1>
                        <p className="text-text-muted mb-8">Your account is now fully verified.</p>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h1 className="text-headline-sm text-error mb-4">Verification Failed</h1>
                        <p className="text-text-muted mb-8">{message}</p>
                    </>
                )}
                <Link to="/" className="bg-primary text-white px-6 py-3 rounded-xl font-bold inline-block">
                    Go to Homepage
                </Link>
            </div>
        </div>
    );
}
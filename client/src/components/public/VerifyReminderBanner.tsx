import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { authApi } from '../../lib/api/auth';

export default function VerifyReminderBanner() {
    const user = useAuthStore((s) => s.user);
    const [sent, setSent] = useState(false);

    if (!user || user.isEmailVerified) return null;

    const handleResend = async () => {
        await authApi.resendVerification();
        setSent(true);
    };

    return (
        <div className="bg-tertiary-fixed text-tertiary text-body-sm px-6 py-2 text-center">
            Please verify your email to unlock all features.{' '}
            {sent ? 'Verification email sent!' : (
                <button onClick={handleResend} className="underline font-semibold">Resend verification email</button>
            )}
        </div>
    );
}
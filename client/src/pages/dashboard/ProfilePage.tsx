import { useEffect, useState, type FormEvent } from 'react';
import { BadgeCheck, MailWarning } from 'lucide-react';
import { accountApi } from '../../lib/api/account';
import { authApi } from '../../lib/api/auth';
import { useAuthStore } from '../../store/useAuthStore';
import type { AccountProfile } from '../../types/account';

export default function ProfilePage() {
    const updateUser = useAuthStore((s) => s.updateUser);

    const [profile, setProfile] = useState<AccountProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // personal info form
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

    // email verification
    const [resent, setResent] = useState(false);

    // password form
    const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
    const [savingPw, setSavingPw] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

    useEffect(() => {
        accountApi
            .getProfile()
            .then((data) => {
                setProfile(data);
                setFullName(data.fullName);
                setPhone(data.phone || '');
                // Keeps the stored session fresh — also clears the "verify your email"
                // banner if the account was verified since the last login.
                updateUser({ fullName: data.fullName, isEmailVerified: data.isEmailVerified });
            })
            .finally(() => setLoading(false));
    }, [updateUser]);

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setProfileMsg(null);
        setSavingProfile(true);
        try {
            const updated = await accountApi.updateProfile({ fullName, phone });
            setProfile(updated);
            updateUser({ fullName: updated.fullName });
            setProfileMsg({ type: 'ok', text: 'Profile updated.' });
        } catch (err: any) {
            const message = err.response?.data?.message;
            setProfileMsg({ type: 'error', text: Array.isArray(message) ? message.join(', ') : message || 'Failed to update profile' });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPwMsg(null);

        if (pw.next !== pw.confirm) {
            setPwMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        setSavingPw(true);
        try {
            await accountApi.changePassword({ currentPassword: pw.current, newPassword: pw.next });
            setPw({ current: '', next: '', confirm: '' });
            setPwMsg({ type: 'ok', text: 'Password updated.' });
        } catch (err: any) {
            const message = err.response?.data?.message;
            setPwMsg({ type: 'error', text: Array.isArray(message) ? message.join(', ') : message || 'Failed to update password' });
        } finally {
            setSavingPw(false);
        }
    };

    const handleResend = async () => {
        await authApi.resendVerification();
        setResent(true);
    };

    if (loading) return <p className="text-body-sm text-text-muted">Loading...</p>;
    if (!profile) return <p className="text-error">Could not load your profile.</p>;

    const inputClass =
        'w-full border border-mountain-mist rounded-lg px-4 py-2.5 text-body-md focus:outline-none focus:border-secondary';

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="text-headline-sm text-primary">Profile</h2>

            <form onSubmit={handleProfileSubmit} className="card p-6 space-y-4">
                <h3 className="font-semibold text-primary">Personal Information</h3>

                <div>
                    <label className="label text-primary mb-2 block">Full Name</label>
                    <input type="text" required minLength={2} value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
                </div>

                <div>
                    <label className="label text-primary mb-2 block">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+92 300 1234567" />
                </div>

                <div>
                    <label className="label text-primary mb-2 block">Email</label>
                    <input type="email" value={profile.email} disabled className={`${inputClass} bg-surface-container-low text-text-muted`} />
                    <p className="text-body-sm text-text-muted mt-1">Email can't be changed.</p>
                </div>

                {profileMsg && (
                    <p className={`text-body-sm rounded-lg px-3 py-2 ${profileMsg.type === 'ok' ? 'text-primary bg-primary-fixed/40' : 'text-error bg-error-container/40'}`}>
                        {profileMsg.text}
                    </p>
                )}

                <button type="submit" disabled={savingProfile} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition-colors disabled:opacity-50">
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
            </form>

            <div className="card p-6">
                <h3 className="font-semibold text-primary mb-3">Email Verification</h3>
                {profile.isEmailVerified ? (
                    <p className="flex items-center gap-2 text-body-sm text-primary">
                        <BadgeCheck size={18} /> Your email address is verified.
                    </p>
                ) : (
                    <div>
                        <p className="flex items-center gap-2 text-body-sm text-tertiary mb-3">
                            <MailWarning size={18} /> Your email address hasn't been verified yet.
                        </p>
                        {resent ? (
                            <p className="text-body-sm text-text-muted">Verification email sent — check your inbox.</p>
                        ) : (
                            <button onClick={handleResend} className="border border-mountain-mist px-4 py-2 rounded-lg text-body-sm font-semibold hover:bg-surface-container-low">
                                Resend verification email
                            </button>
                        )}
                    </div>
                )}
            </div>

            <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-4">
                <h3 className="font-semibold text-primary">Change Password</h3>

                <div>
                    <label className="label text-primary mb-2 block">Current Password</label>
                    <input type="password" required value={pw.current} onChange={(e) => setPw((p) => ({ ...p, current: e.target.value }))} className={inputClass} autoComplete="current-password" />
                </div>
                <div>
                    <label className="label text-primary mb-2 block">New Password</label>
                    <input type="password" required minLength={8} value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} className={inputClass} autoComplete="new-password" />
                </div>
                <div>
                    <label className="label text-primary mb-2 block">Confirm New Password</label>
                    <input type="password" required minLength={8} value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} className={inputClass} autoComplete="new-password" />
                </div>

                {pwMsg && (
                    <p className={`text-body-sm rounded-lg px-3 py-2 ${pwMsg.type === 'ok' ? 'text-primary bg-primary-fixed/40' : 'text-error bg-error-container/40'}`}>
                        {pwMsg.text}
                    </p>
                )}

                <button type="submit" disabled={savingPw} className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-container transition-colors disabled:opacity-50">
                    {savingPw ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}   
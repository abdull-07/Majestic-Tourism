import { useEffect, useState } from 'react';
import { Users as UsersIcon } from 'lucide-react';
import { adminUsersApi } from '../../../lib/api/admin-users';
import { useAuthStore } from '../../../store/useAuthStore';
import type { AdminUser } from '../../../types/admin-user';

const roleFilters = ['All', 'CUSTOMER', 'STAFF', 'ADMIN', 'SUPER_ADMIN'];
const ROLE_OPTIONS = ['CUSTOMER', 'STAFF', 'ADMIN', 'SUPER_ADMIN'];

export default function UsersList() {
    const currentUser = useAuthStore((s) => s.user);
    const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState<string | null>(null);
    const [error, setError] = useState('');

    const load = () => {
        setLoading(true);
        adminUsersApi.getAll(filter === 'All' ? undefined : filter).then(setUsers).finally(() => setLoading(false));
    };

    useEffect(load, [filter]);

    const handleRoleChange = async (id: string, role: string) => {
        setError('');
        setActingId(id);
        try {
            await adminUsersApi.updateRole(id, role);
            load();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update role');
        } finally {
            setActingId(null);
        }
    };

    const handleStatusToggle = async (id: string, currentStatus: boolean) => {
        setError('');
        setActingId(id);
        try {
            await adminUsersApi.updateStatus(id, !currentStatus);
            load();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update status');
        } finally {
            setActingId(null);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-headline-sm text-primary">Users</h1>
                <p className="text-body-sm text-text-muted">
                    {isSuperAdmin ? 'Manage roles and account status' : 'View accounts — role changes require a Super Admin'}
                </p>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
                {roleFilters.map((r) => (
                    <button
                        key={r}
                        onClick={() => setFilter(r)}
                        className={`px-4 py-1.5 rounded-full label transition-colors ${filter === r ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {error && <p className="text-body-sm text-error bg-error-container/40 rounded-lg px-3 py-2 mb-4">{error}</p>}

            <div className="card overflow-hidden">
                {loading ? (
                    <p className="p-6 text-body-sm text-text-muted">Loading...</p>
                ) : users.length === 0 ? (
                    <div className="p-10 text-center">
                        <UsersIcon className="mx-auto text-mountain-mist mb-2" size={32} />
                        <p className="text-body-sm text-text-muted">No users match this filter.</p>
                    </div>
                ) : (
                    <table className="w-full text-body-sm">
                        <thead className="bg-surface-container-low border-b border-mountain-mist text-left text-text-muted">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">Bookings</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                                <th className="px-4 py-3 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-mountain-mist">
                            {users.map((u) => {
                                const isSelf = u.id === currentUser?.id;
                                return (
                                    <tr key={u.id} className="hover:bg-surface-container-low">
                                        <td className="px-4 py-3 font-medium text-on-surface">{u.fullName}</td>
                                        <td className="px-4 py-3 text-text-muted">{u.email}</td>
                                        <td className="px-4 py-3 text-text-muted">{u._count?.bookings ?? 0}</td>
                                        <td className="px-4 py-3">
                                            {isSuperAdmin ? (
                                                <select
                                                    value={u.role}
                                                    disabled={isSelf || actingId === u.id}
                                                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                    className="border border-mountain-mist rounded-lg px-2 py-1 text-body-sm disabled:opacity-50"
                                                >
                                                    {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                                </select>
                                            ) : (
                                                <span className="label text-text-muted">{u.role}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatusToggle(u.id, u.isActive)}
                                                disabled={isSelf || actingId === u.id}
                                                className={`px-2 py-0.5 rounded-full label transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${u.isActive ? 'bg-primary-fixed text-primary' : 'bg-error-container text-error'
                                                    }`}
                                                title={isSelf ? "You can't change your own status" : 'Click to toggle'}
                                            >
                                                {u.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { TrendingUp, Users, Compass, CalendarCheck, AlertCircle } from 'lucide-react';

type DashboardStats = {
    totalBookings: number;
    totalTours: number;
    totalCustomers: number;
    totalDestinations: number;
    totalRevenue: number;
    pendingPaymentsCount: number;
    pendingReviewsCount: number;
    bookingsByStatus: Record<string, number>;
    recentBookings: Array<{
        id: string; bookingNumber: string; status: string; totalAmount: number;
        createdAt: string; tourTitle: string; customerName: string; customerEmail: string;
    }>;
    topTours: Array<{ tour: { title: string } | undefined; bookingCount: number }>;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<DashboardStats>('/admin/dashboard/stats').then((r) => setStats(r.data)).finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="text-text-muted">Loading dashboard...</p>;
    if (!stats) return <p className="text-error">Could not load dashboard stats.</p>;

    const cards = [
        { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck },
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp },
        { label: 'Active Tours', value: stats.totalTours, icon: Compass },
        { label: 'Customers', value: stats.totalCustomers, icon: Users },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-headline-sm text-primary">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {cards.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="card p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-text-muted text-body-sm">{label}</span>
                            <Icon size={18} className="text-primary" />
                        </div>
                        <p className="text-headline-sm text-primary">{value}</p>
                    </div>
                ))}
            </div>

            {(stats.pendingPaymentsCount > 0 || stats.pendingReviewsCount > 0) && (
                <div className="card p-5 border-l-4 !border-l-tertiary">
                    <div className="flex items-center gap-2 text-tertiary font-semibold mb-1">
                        <AlertCircle size={18} /> Needs Attention
                    </div>
                    <p className="text-body-sm text-text-muted">
                        {stats.pendingPaymentsCount} payment{stats.pendingPaymentsCount === 1 ? '' : 's'} awaiting verification ·{' '}
                        {stats.pendingReviewsCount} review{stats.pendingReviewsCount === 1 ? '' : 's'} awaiting moderation
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-5">
                    <h3 className="font-semibold text-primary mb-4">Recent Bookings</h3>
                    {stats.recentBookings.length === 0 ? (
                        <p className="text-text-muted text-body-sm">No bookings yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentBookings.map((b) => (
                                <div key={b.id} className="flex items-center justify-between text-body-sm border-b border-mountain-mist pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <p className="font-medium text-on-surface">{b.tourTitle}</p>
                                        <p className="text-text-muted">{b.customerName} · {b.bookingNumber}</p>
                                    </div>
                                    <span className="text-secondary font-semibold">${Number(b.totalAmount).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="card p-5">
                    <h3 className="font-semibold text-primary mb-4">Top Tours</h3>
                    {stats.topTours.length === 0 ? (
                        <p className="text-text-muted text-body-sm">No booking data yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.topTours.map((t, i) => (
                                <div key={i} className="flex items-center justify-between text-body-sm border-b border-mountain-mist pb-3 last:border-0 last:pb-0">
                                    <span className="text-on-surface">{t.tour?.title || 'Unknown tour'}</span>
                                    <span className="text-primary font-semibold">{t.bookingCount} bookings</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
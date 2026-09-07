import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookingStatus, PaymentStatus, Role } from '../generated/prisma/client';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const [
            totalBookings,
            totalTours,
            totalCustomers,
            totalDestinations,
            revenueResult,
            bookingsByStatus,
            pendingPaymentsCount,
            pendingReviewsCount,
            recentBookings,
            monthlyRevenue,
            topTours,
        ] = await Promise.all([
            this.prisma.booking.count(),

            this.prisma.tour.count({ where: { isActive: true } }),

            this.prisma.user.count({ where: { role: Role.CUSTOMER } }),

            this.prisma.destination.count({ where: { isActive: true } }),

            this.prisma.payment.aggregate({
                where: { status: PaymentStatus.VERIFIED },
                _sum: { amount: true },
            }),

            this.prisma.booking.groupBy({
                by: ['status'],
                _count: { _all: true },
            }),

            this.prisma.payment.count({ where: { status: PaymentStatus.PENDING } }),

            this.prisma.review.count({ where: { status: 'PENDING' } }),

            this.prisma.booking.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    bookingNumber: true,
                    status: true,
                    totalAmount: true,
                    createdAt: true,
                    guestName: true,
                    guestEmail: true,
                    user: { select: { fullName: true, email: true } },
                    tour: { select: { title: true } },
                },
            }),

            this.getMonthlyRevenue(),

            this.getTopToursByBookings(),
        ]);

        return {
            totalBookings,
            totalTours,
            totalCustomers,
            totalDestinations,
            totalRevenue: revenueResult._sum.amount ?? 0,
            pendingPaymentsCount,
            pendingReviewsCount,
            bookingsByStatus: this.formatStatusCounts(bookingsByStatus),
            recentBookings: recentBookings.map((b) => ({
                id: b.id,
                bookingNumber: b.bookingNumber,
                status: b.status,
                totalAmount: b.totalAmount,
                createdAt: b.createdAt,
                tourTitle: b.tour.title,
                customerName: b.user?.fullName ?? b.guestName ?? 'Guest',
                customerEmail: b.user?.email ?? b.guestEmail ?? '',
            })),
            monthlyRevenue,
            topTours,
        };
    }

    private formatStatusCounts(
        grouped: { status: BookingStatus; _count: { _all: number } }[],
    ) {
        const base: Record<BookingStatus, number> = {
            PENDING: 0,
            CONFIRMED: 0,
            COMPLETED: 0,
            CANCELLED: 0,
            EXPIRED: 0,
        };
        for (const g of grouped) {
            base[g.status] = g._count._all;
        }
        return base;
    }

    private async getMonthlyRevenue() {
        return this.prisma.$queryRaw<{ month: Date; total: number }[]>`
      SELECT DATE_TRUNC('month', "createdAt") AS month,
             COALESCE(SUM(amount), 0)::float AS total
      FROM payments
      WHERE status = 'VERIFIED'
        AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC;
    `;
    }

    private async getTopToursByBookings() {
        const grouped = await this.prisma.booking.groupBy({
            by: ['tourId'],
            where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
            _count: { _all: true },
            orderBy: { _count: { tourId: 'desc' } },
            take: 5,
        });

        const tourIds = grouped.map((g) => g.tourId);
        const tours = await this.prisma.tour.findMany({
            where: { id: { in: tourIds } },
            select: { id: true, title: true, slug: true },
        });

        return grouped.map((g) => ({
            tour: tours.find((t) => t.id === g.tourId),
            bookingCount: g._count._all,
        }));
    }
}
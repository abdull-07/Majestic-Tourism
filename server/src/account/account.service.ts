import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) { }

    private sumVerified(payments: { amount: unknown; status: string }[]) {
        return payments
            .filter((p) => p.status === 'VERIFIED')
            .reduce((sum, p) => sum + Number(p.amount), 0);
    }

    async getBookings(userId: string) {
        const bookings = await this.prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        destination: { select: { name: true } },
                        images: { where: { isCover: true }, take: 1, select: { url: true } },
                    },
                },
                availability: { select: { departureDate: true } },
                payments: { select: { amount: true, status: true } },
                review: { select: { id: true, status: true } },
            },
        });

        return bookings.map(({ payments, ...booking }) => ({
            ...booking,
            paidAmount: this.sumVerified(payments),
        }));
    }

    async getBooking(userId: string, id: string) {
        // Scoped by userId: asking for someone else's booking returns 404, not 403,
        // so booking IDs can't be probed for existence.
        const booking = await this.prisma.booking.findFirst({
            where: { id, userId },
            include: {
                tour: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        destination: { select: { name: true } },
                        images: { where: { isCover: true }, take: 1, select: { url: true } },
                    },
                },
                availability: { select: { departureDate: true } },
                payments: { orderBy: { createdAt: 'desc' } },
                review: { select: { id: true, status: true } },
            },
        });

        if (!booking) throw new NotFoundException('Booking not found');

        return { ...booking, paidAmount: this.sumVerified(booking.payments) };
    }

    getPayments(userId: string) {
        return this.prisma.payment.findMany({
            where: { booking: { userId } },
            orderBy: { createdAt: 'desc' },
            include: {
                booking: {
                    select: { bookingNumber: true, tour: { select: { title: true } } },
                },
            },
        });
    }

    getReviews(userId: string) {
        return this.prisma.review.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { tour: { select: { title: true, slug: true } } },
        });
    }

    updateProfile(userId: string, dto: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: dto,
            select: { id: true, email: true, fullName: true, phone: true, role: true, isEmailVerified: true },
        });
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        const valid = await bcrypt.compare(dto.currentPassword, user.password);
        if (!valid) throw new BadRequestException('Current password is incorrect');

        const hashed = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });

        return { message: 'Password updated successfully' };
    }
}   
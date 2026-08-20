import {
    Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private prisma: PrismaService) { }

    async create(bookingNumber: string, dto: CreatePaymentDto) {
        const booking = await this.prisma.booking.findUnique({
            where: { bookingNumber },
            include: { payments: true },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status === 'CANCELLED' || booking.status === 'EXPIRED') {
            throw new ConflictException(`Cannot submit payment for a ${booking.status.toLowerCase()} booking`);
        }
        if (booking.status === 'COMPLETED') {
            throw new ConflictException('This booking is already completed');
        }

        if (dto.method === 'BANK_TRANSFER' && !dto.proofUrl) {
            throw new BadRequestException('Bank transfer payments require a proofUrl (proof of payment)');
        }

        return this.prisma.payment.create({
            data: {
                bookingId: booking.id,
                method: dto.method,
                amount: dto.amount,
                transactionRef: dto.transactionRef,
                proofUrl: dto.proofUrl,
                status: 'PENDING',
            },
        });
    }

    // ---- Admin ----

    findAll(status?: string) {
        return this.prisma.payment.findMany({
            where: status ? { status: status as any } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                booking: { select: { bookingNumber: true, totalAmount: true, guestName: true, guestEmail: true } },
            },
        });
    }

    async findOne(id: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
            include: { booking: true },
        });
        if (!payment) throw new NotFoundException('Payment not found');
        return payment;
    }

    async verify(id: string, adminId: string) {
        const payment = await this.findOne(id);

        if (payment.status === 'VERIFIED') {
            throw new ConflictException('Payment is already verified');
        }

        return this.prisma.$transaction(async (tx) => {
            const updatedPayment = await tx.payment.update({
                where: { id },
                data: { status: 'VERIFIED', verifiedById: adminId, verifiedAt: new Date() },
            });

            // Check if total verified payments now cover the booking's full amount
            const verifiedPayments = await tx.payment.findMany({
                where: { bookingId: payment.bookingId, status: 'VERIFIED' },
            });
            const totalPaid = verifiedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

            const booking = await tx.booking.findUniqueOrThrow({ where: { id: payment.bookingId } });

            if (totalPaid >= Number(booking.totalAmount) && booking.status === 'PENDING') {
                await tx.booking.update({
                    where: { id: booking.id },
                    data: { status: 'CONFIRMED', holdExpiresAt: null }, // confirmed bookings no longer expire
                });
            }

            return { payment: updatedPayment, totalPaid, bookingTotal: Number(booking.totalAmount) };
        });
    }

    async reject(id: string, adminId: string) {
        const payment = await this.findOne(id);

        if (payment.status === 'VERIFIED') {
            throw new ConflictException('Cannot reject a payment that has already been verified');
        }

        return this.prisma.payment.update({
            where: { id },
            data: { status: 'FAILED', verifiedById: adminId, verifiedAt: new Date() },
        });
    }
}
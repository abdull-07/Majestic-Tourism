import {
    Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

const HOLD_DURATION_MINUTES = 30;

@Injectable()
export class BookingsService {
    constructor(private prisma: PrismaService) { }

    private generateBookingNumber(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `MT-${timestamp}-${random}`;
    }

    async create(dto: CreateBookingDto, userId: string | null) {
        if (!userId && (!dto.guestName || !dto.guestEmail || !dto.guestPhone)) {
            throw new BadRequestException(
                'Guest bookings require guestName, guestEmail, and guestPhone',
            );
        }

        const children = dto.children ?? 0;

        // Transaction: check seat availability and reserve seats atomically,
        // so two simultaneous bookings can't both succeed past capacity.
        return this.prisma.$transaction(async (tx) => {
            const tour = await tx.tour.findUnique({ where: { id: dto.tourId } });
            if (!tour || !tour.isActive) {
                throw new NotFoundException('Tour not found');
            }

            const availability = await tx.tourAvailability.findUnique({
                where: { id: dto.availabilityId },
            });
            if (!availability || availability.tourId !== dto.tourId) {
                throw new NotFoundException('Departure date not found for this tour');
            }
            if (availability.status === 'CLOSED' || availability.status === 'SOLD_OUT') {
                throw new ConflictException('This departure date is no longer available');
            }

            const requestedSeats = dto.adults + children;
            const remainingSeats = availability.totalSeats - availability.bookedSeats;
            if (requestedSeats > remainingSeats) {
                throw new ConflictException(
                    `Only ${remainingSeats} seat(s) remaining for this departure date`,
                );
            }

            // Price calculation — children priced at childPrice if set, otherwise same as adult rate
            const adultTotal = dto.adults * Number(tour.basePrice);
            const childRate = tour.childPrice ? Number(tour.childPrice) : Number(tour.basePrice);
            const childTotal = children * childRate;
            let totalAmount = adultTotal + childTotal;

            let couponId: string | null = null;
            if (dto.couponCode) {
                const coupon = await tx.coupon.findUnique({ where: { code: dto.couponCode } });
                if (!coupon || !coupon.isActive || coupon.validTo < new Date() || coupon.validFrom > new Date()) {
                    throw new BadRequestException('Coupon is invalid or expired');
                }
                if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
                    throw new BadRequestException('Coupon usage limit reached');
                }
                if (coupon.minAmount && totalAmount < Number(coupon.minAmount)) {
                    throw new BadRequestException(`Coupon requires a minimum booking amount of ${coupon.minAmount}`);
                }

                const discount = coupon.discountType === 'PERCENTAGE'
                    ? totalAmount * (Number(coupon.discountValue) / 100)
                    : Number(coupon.discountValue);
                totalAmount = Math.max(0, totalAmount - discount);
                couponId = coupon.id;

                await tx.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
            }

            // Reserve seats immediately (released later if the hold expires unpaid)
            const newBookedSeats = availability.bookedSeats + requestedSeats;
            await tx.tourAvailability.update({
                where: { id: availability.id },
                data: {
                    bookedSeats: newBookedSeats,
                    status: newBookedSeats >= availability.totalSeats ? 'SOLD_OUT' : availability.status,
                },
            });

            const booking = await tx.booking.create({
                data: {
                    bookingNumber: this.generateBookingNumber(),
                    userId: userId ?? undefined,
                    tourId: dto.tourId,
                    availabilityId: dto.availabilityId,
                    adults: dto.adults,
                    children,
                    totalAmount,
                    couponId: couponId ?? undefined,
                    guestName: dto.guestName,
                    guestEmail: dto.guestEmail,
                    guestPhone: dto.guestPhone,
                    status: 'PENDING',
                    holdExpiresAt: new Date(Date.now() + HOLD_DURATION_MINUTES * 60 * 1000),
                },
            });

            return booking;
        });
    }

    async findByBookingNumber(bookingNumber: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { bookingNumber },
            include: { tour: { select: { title: true, slug: true } }, payments: true },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        return booking;
    }

    // ---- Admin ----

    findAll(status?: string) {
        return this.prisma.booking.findMany({
            where: status ? { status: status as any } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                tour: { select: { title: true } },
                user: { select: { fullName: true, email: true } },
            },
        });
    }

    async findOne(id: string) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                tour: true,
                availability: true,
                user: { select: { fullName: true, email: true, phone: true } },
                payments: true,
            },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        return booking;
    }

    async updateStatus(id: string, dto: UpdateBookingStatusDto) {
        const booking = await this.findOne(id);

        // If cancelling, release the held seats back to availability
        if (dto.status === 'CANCELLED' && booking.status !== 'CANCELLED') {
            const seats = booking.adults + booking.children;
            await this.prisma.tourAvailability.update({
                where: { id: booking.availabilityId },
                data: {
                    bookedSeats: { decrement: seats },
                    status: 'OPEN',
                },
            });
        }

        return this.prisma.booking.update({
            where: { id },
            data: { status: dto.status },
        });
    }
}
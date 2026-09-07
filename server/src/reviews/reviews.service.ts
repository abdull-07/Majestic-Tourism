import {
    Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, dto: CreateReviewDto) {
        const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        if (booking.userId !== userId) {
            throw new ForbiddenException('You can only review your own bookings');
        }
        if (booking.status !== 'COMPLETED') {
            throw new ConflictException('You can only review a tour after your booking is marked completed');
        }

        const existing = await this.prisma.review.findUnique({ where: { bookingId: dto.bookingId } });
        if (existing) {
            throw new ConflictException('You have already reviewed this booking');
        }

        return this.prisma.review.create({
            data: {
                userId,
                tourId: booking.tourId,
                bookingId: dto.bookingId,
                rating: dto.rating,
                comment: dto.comment,
                images: dto.images ?? [],
                status: 'PENDING',
            },
        });
    }

    // ---- Public ----

    findApprovedForTour(tourId: string) {
        return this.prisma.review.findMany({
            where: { tourId, status: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { fullName: true } } },
        });
    }

    // ---- Admin ----

    findAll(status?: string) {
        return this.prisma.review.findMany({
            where: status ? { status: status as any } : undefined,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { fullName: true, email: true } },
                tour: { select: { title: true } },
            },
        });
    }

    async moderate(id: string, dto: ModerateReviewDto) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');

        return this.prisma.review.update({
            where: { id },
            data: { status: dto.status },
        });
    }

    async remove(id: string) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) throw new NotFoundException('Review not found');

        return this.prisma.review.delete({ where: { id } });
    }
}

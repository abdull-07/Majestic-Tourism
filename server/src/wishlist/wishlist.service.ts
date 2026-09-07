import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';

@Injectable()
export class WishlistService {
    constructor(private prisma: PrismaService) { }

    async findAllForUser(userId: string) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                tour: {
                    select: {
                        id: true, title: true, slug: true, basePrice: true, durationDays: true,
                        destination: { select: { name: true } },
                        images: { where: { isCover: true }, take: 1 },
                    },
                },
            },
        });
    }

    async add(userId: string, dto: AddWishlistItemDto) {
        const tour = await this.prisma.tour.findUnique({ where: { id: dto.tourId } });
        if (!tour || !tour.isActive) {
            throw new NotFoundException('Tour not found');
        }

        const existing = await this.prisma.wishlist.findUnique({
            where: { userId_tourId: { userId, tourId: dto.tourId } },
        });
        if (existing) {
            throw new ConflictException('This tour is already in your wishlist');
        }

        return this.prisma.wishlist.create({
            data: { userId, tourId: dto.tourId },
        });
    }

    async remove(userId: string, tourId: string) {
        const existing = await this.prisma.wishlist.findUnique({
            where: { userId_tourId: { userId, tourId } },
        });
        if (!existing) {
            throw new NotFoundException('This tour is not in your wishlist');
        }

        return this.prisma.wishlist.delete({
            where: { userId_tourId: { userId, tourId } },
        });
    }
}
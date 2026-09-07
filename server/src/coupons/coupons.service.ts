import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    }

    async findOne(id: string) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon) throw new NotFoundException('Coupon not found');
        return coupon;
    }

    private validateDateRange(validFrom: string, validTo: string) {
        if (new Date(validFrom) >= new Date(validTo)) {
            throw new BadRequestException('validFrom must be before validTo');
        }
    }

    async create(dto: CreateCouponDto) {
        this.validateDateRange(dto.validFrom, dto.validTo);

        const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
        if (existing) {
            throw new ConflictException(`Coupon code "${dto.code}" already exists`);
        }

        return this.prisma.coupon.create({
            data: {
                ...dto,
                validFrom: new Date(dto.validFrom),
                validTo: new Date(dto.validTo),
            },
        });
    }

    async update(id: string, dto: UpdateCouponDto) {
        await this.findOne(id);

        if (dto.validFrom && dto.validTo) {
            this.validateDateRange(dto.validFrom, dto.validTo);
        }

        return this.prisma.coupon.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.validFrom && { validFrom: new Date(dto.validFrom) }),
                ...(dto.validTo && { validTo: new Date(dto.validTo) }),
            },
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        const usageCount = await this.prisma.booking.count({ where: { couponId: id } });
        if (usageCount > 0) {
            throw new ConflictException(
                `Cannot delete: this coupon has been used in ${usageCount} booking(s). Deactivate it instead (set isActive to false).`,
            );
        }

        return this.prisma.coupon.delete({ where: { id } });
    }
}
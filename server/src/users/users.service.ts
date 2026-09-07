import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    findAll(role?: string) {
        return this.prisma.user.findMany({
            where: role ? { role: role as any } : undefined,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, email: true, fullName: true, phone: true, role: true,
                isActive: true, isEmailVerified: true, createdAt: true,
                _count: { select: { bookings: true, reviews: true } },
            },
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true, email: true, fullName: true, phone: true, role: true,
                isActive: true, isEmailVerified: true, createdAt: true,
                bookings: {
                    select: { id: true, bookingNumber: true, status: true, totalAmount: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateRole(id: string, dto: UpdateUserRoleDto, requestingUserId: string) {
        if (id === requestingUserId) {
            throw new ForbiddenException('You cannot change your own role');
        }

        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.user.update({
            where: { id },
            data: { role: dto.role },
            select: { id: true, email: true, fullName: true, role: true },
        });
    }

    async updateStatus(id: string, dto: UpdateUserStatusDto, requestingUserId: string) {
        if (id === requestingUserId) {
            throw new ForbiddenException('You cannot deactivate your own account');
        }

        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');

        return this.prisma.user.update({
            where: { id },
            data: { isActive: dto.isActive },
            select: { id: true, email: true, fullName: true, isActive: true },
        });
    }
}   
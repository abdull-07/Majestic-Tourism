import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
    constructor(private prisma: PrismaService) { }

    private slugify(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    private async generateUniqueSlug(name: string): Promise<string> {
        const base = this.slugify(name);
        let slug = base;
        let counter = 1;

        while (await this.prisma.destination.findUnique({ where: { slug } })) {
            slug = `${base}-${counter}`;
            counter++;
        }

        return slug;
    }

    findAllActive() {
        return this.prisma.destination.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
            include: { _count: { select: { tours: true } } },
        });
    }

    async findBySlug(slug: string) {
        const destination = await this.prisma.destination.findUnique({
            where: { slug },
            include: {
                tours: {
                    where: { isActive: true },
                    select: { id: true, title: true, slug: true, basePrice: true, durationDays: true },
                },
            },
        });

        if (!destination || !destination.isActive) {
            throw new NotFoundException('Destination not found');
        }

        return destination;
    }

    findAll() {
        return this.prisma.destination.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { tours: true } } },
        });
    }

    async findOne(id: string) {
        const destination = await this.prisma.destination.findUnique({ where: { id } });
        if (!destination) {
            throw new NotFoundException('Destination not found');
        }
        return destination;
    }

    async create(dto: CreateDestinationDto) {
        const slug = await this.generateUniqueSlug(dto.name);

        return this.prisma.destination.create({
            data: { ...dto, slug },
        });
    }

    async update(id: string, dto: UpdateDestinationDto) {
        await this.findOne(id);

        return this.prisma.destination.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        const tourCount = await this.prisma.tour.count({ where: { destinationId: id } });
        if (tourCount > 0) {
            throw new ConflictException(
                `Cannot delete: ${tourCount} tour(s) are linked to this destination. Reassign or delete them first.`,
            );
        }

        return this.prisma.destination.delete({ where: { id } });
    }
}
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateItineraryDayDto, UpdateItineraryDayDto } from './dto/tour-itinerary.dto';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/tour-availability.dto';

@Injectable()
export class ToursService {
    constructor(private prisma: PrismaService) { }

    private slugify(title: string): string {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    private async generateUniqueSlug(title: string): Promise<string> {
        const base = this.slugify(title);
        let slug = base;
        let counter = 1;

        while (await this.prisma.tour.findUnique({ where: { slug } })) {
            slug = `${base}-${counter}`;
            counter++;
        }

        return slug;
    }

    // ---- Public ----

    findAllActive(filters: { destinationId?: string; category?: string }) {
        return this.prisma.tour.findMany({
            where: {
                isActive: true,
                ...(filters.destinationId && { destinationId: filters.destinationId }),
                ...(filters.category && { category: filters.category as any }),
            },
            orderBy: { createdAt: 'desc' },
            include: {
                destination: { select: { name: true, slug: true } },
                images: { where: { isCover: true }, take: 1 },
            },
        });
    }

    async findBySlug(slug: string) {
        const tour = await this.prisma.tour.findUnique({
            where: { slug },
            include: {
                destination: true,
                itinerary: { orderBy: { dayNumber: 'asc' } },
                images: { orderBy: { sortOrder: 'asc' } },
                availability: {
                    where: { departureDate: { gte: new Date() }, status: { not: 'CLOSED' } },
                    orderBy: { departureDate: 'asc' },
                },
                reviews: { where: { status: 'APPROVED' }, include: { user: { select: { fullName: true } } } },
            },
        });

        if (!tour || !tour.isActive) {
            throw new NotFoundException('Tour not found');
        }

        return tour;
    }

    // ---- Admin: Tours ----

    findAll() {
        return this.prisma.tour.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                destination: { select: { name: true } },
                _count: { select: { bookings: true, itinerary: true, availability: true } },
            },
        });
    }

    async findOne(id: string) {
        const tour = await this.prisma.tour.findUnique({
            where: { id },
            include: {
                destination: true,
                itinerary: { orderBy: { dayNumber: 'asc' } },
                images: { orderBy: { sortOrder: 'asc' } },
                availability: { orderBy: { departureDate: 'asc' } },
            },
        });

        if (!tour) {
            throw new NotFoundException('Tour not found');
        }
        return tour;
    }

    async create(dto: CreateTourDto) {
        const destination = await this.prisma.destination.findUnique({ where: { id: dto.destinationId } });
        if (!destination) {
            throw new BadRequestException('Destination not found');
        }

        if (dto.maxGroupSize < (dto.minGroupSize ?? 1)) {
            throw new BadRequestException('maxGroupSize cannot be less than minGroupSize');
        }

        const slug = await this.generateUniqueSlug(dto.title);

        return this.prisma.tour.create({
            data: { ...dto, slug },
        });
    }

    async update(id: string, dto: UpdateTourDto) {
        await this.findOne(id);

        if (dto.destinationId) {
            const destination = await this.prisma.destination.findUnique({ where: { id: dto.destinationId } });
            if (!destination) {
                throw new BadRequestException('Destination not found');
            }
        }

        return this.prisma.tour.update({
            where: { id },
            data: dto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);

        const bookingCount = await this.prisma.booking.count({ where: { tourId: id } });
        if (bookingCount > 0) {
            throw new ConflictException(
                `Cannot delete: ${bookingCount} booking(s) exist for this tour.`,
            );
        }

        return this.prisma.tour.delete({ where: { id } });
    }

    // ---- Admin: Itinerary ----

    async addItineraryDay(tourId: string, dto: CreateItineraryDayDto) {
        await this.findOne(tourId);

        const existing = await this.prisma.tourItinerary.findUnique({
            where: { tourId_dayNumber: { tourId, dayNumber: dto.dayNumber } },
        });
        if (existing) {
            throw new ConflictException(`Day ${dto.dayNumber} already exists for this tour`);
        }

        return this.prisma.tourItinerary.create({ data: { ...dto, tourId } });
    }

    async updateItineraryDay(itineraryId: string, dto: UpdateItineraryDayDto) {
        const day = await this.prisma.tourItinerary.findUnique({ where: { id: itineraryId } });
        if (!day) throw new NotFoundException('Itinerary day not found');

        return this.prisma.tourItinerary.update({ where: { id: itineraryId }, data: dto });
    }

    async removeItineraryDay(itineraryId: string) {
        const day = await this.prisma.tourItinerary.findUnique({ where: { id: itineraryId } });
        if (!day) throw new NotFoundException('Itinerary day not found');

        return this.prisma.tourItinerary.delete({ where: { id: itineraryId } });
    }

    // ---- Admin: Availability ----

    async addAvailability(tourId: string, dto: CreateAvailabilityDto) {
        await this.findOne(tourId);

        const existing = await this.prisma.tourAvailability.findUnique({
            where: { tourId_departureDate: { tourId, departureDate: new Date(dto.departureDate) } },
        });
        if (existing) {
            throw new ConflictException('A departure date already exists for this date');
        }

        return this.prisma.tourAvailability.create({
            data: { tourId, departureDate: new Date(dto.departureDate), totalSeats: dto.totalSeats },
        });
    }

    async updateAvailability(availabilityId: string, dto: UpdateAvailabilityDto) {
        const slot = await this.prisma.tourAvailability.findUnique({ where: { id: availabilityId } });
        if (!slot) throw new NotFoundException('Availability slot not found');

        if (dto.totalSeats < slot.bookedSeats) {
            throw new BadRequestException(
                `Cannot set totalSeats below already-booked seats (${slot.bookedSeats})`,
            );
        }

        return this.prisma.tourAvailability.update({
            where: { id: availabilityId },
            data: { departureDate: new Date(dto.departureDate), totalSeats: dto.totalSeats },
        });
    }

    async removeAvailability(availabilityId: string) {
        const slot = await this.prisma.tourAvailability.findUnique({ where: { id: availabilityId } });
        if (!slot) throw new NotFoundException('Availability slot not found');

        if (slot.bookedSeats > 0) {
            throw new ConflictException('Cannot delete a departure date that already has bookings');
        }

        return this.prisma.tourAvailability.delete({ where: { id: availabilityId } });
    }
}
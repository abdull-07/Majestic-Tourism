import {
    Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { CreateItineraryDayDto, UpdateItineraryDayDto } from './dto/tour-itinerary.dto';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/tour-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/tours')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class AdminToursController {
    constructor(private toursService: ToursService) { }

    @Get()
    findAll() {
        return this.toursService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.toursService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateTourDto) {
        return this.toursService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
        return this.toursService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.toursService.remove(id);
    }

    // Itinerary sub-resource
    @Post(':id/itinerary')
    addItineraryDay(@Param('id') id: string, @Body() dto: CreateItineraryDayDto) {
        return this.toursService.addItineraryDay(id, dto);
    }

    @Patch('itinerary/:itineraryId')
    updateItineraryDay(@Param('itineraryId') itineraryId: string, @Body() dto: UpdateItineraryDayDto) {
        return this.toursService.updateItineraryDay(itineraryId, dto);
    }

    @Delete('itinerary/:itineraryId')
    removeItineraryDay(@Param('itineraryId') itineraryId: string) {
        return this.toursService.removeItineraryDay(itineraryId);
    }

    // Availability sub-resource
    @Post(':id/availability')
    addAvailability(@Param('id') id: string, @Body() dto: CreateAvailabilityDto) {
        return this.toursService.addAvailability(id, dto);
    }

    @Patch('availability/:availabilityId')
    updateAvailability(@Param('availabilityId') availabilityId: string, @Body() dto: UpdateAvailabilityDto) {
        return this.toursService.updateAvailability(availabilityId, dto);
    }

    @Delete('availability/:availabilityId')
    removeAvailability(@Param('availabilityId') availabilityId: string) {
        return this.toursService.removeAvailability(availabilityId);
    }
}
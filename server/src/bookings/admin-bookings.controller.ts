import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class AdminBookingsController {
    constructor(private bookingsService: BookingsService) { }

    @Get()
    findAll(@Query('status') status?: string) {
        return this.bookingsService.findAll(status);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
        return this.bookingsService.updateStatus(id, dto);
    }
}
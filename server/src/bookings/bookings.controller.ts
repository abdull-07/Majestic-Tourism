import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private bookingsService: BookingsService) { }

    @UseGuards(OptionalJwtAuthGuard)
    @Post()
    create(@Body() dto: CreateBookingDto, @Req() req: any) {
        const userId = req.user?.id ?? null;
        return this.bookingsService.create(dto, userId);
    }

    @Get(':bookingNumber')
    findByBookingNumber(@Param('bookingNumber') bookingNumber: string) {
        return this.bookingsService.findByBookingNumber(bookingNumber);
    }
}
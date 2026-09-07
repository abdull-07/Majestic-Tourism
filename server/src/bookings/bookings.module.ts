import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { AdminBookingsController } from './admin-bookings.controller';

@Module({
    controllers: [BookingsController, AdminBookingsController],
    providers: [BookingsService],
})
export class BookingsModule { } 
import { Controller, Post, Body, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('bookings/:bookingNumber/payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Post()
    create(@Param('bookingNumber') bookingNumber: string, @Body() dto: CreatePaymentDto) {
        return this.paymentsService.create(bookingNumber, dto);
    }
}
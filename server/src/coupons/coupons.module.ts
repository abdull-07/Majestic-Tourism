import { Module } from '@nestjs/common';
import { AdminCouponsController } from './admin-coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
    controllers: [AdminCouponsController],
    providers: [CouponsService],
})
export class CouponsModule { }
import {
    Controller, Get, Post, Patch, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class AdminCouponsController {
    constructor(private couponsService: CouponsService) { }

    @Get()
    findAll() {
        return this.couponsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.couponsService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateCouponDto) {
        return this.couponsService.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
        return this.couponsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.couponsService.remove(id);
    }
}
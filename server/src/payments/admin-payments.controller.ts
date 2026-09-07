import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class AdminPaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Get()
    findAll(@Query('status') status?: string) {
        return this.paymentsService.findAll(status);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.paymentsService.findOne(id);
    }

    @Patch(':id/verify')
    verify(@Param('id') id: string, @CurrentUser('id') adminId: string) {
        return this.paymentsService.verify(id, adminId);
    }

    @Patch(':id/reject')
    reject(@Param('id') id: string, @CurrentUser('id') adminId: string) {
        return this.paymentsService.reject(id, adminId);
    }
}
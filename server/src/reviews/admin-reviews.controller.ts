import { Controller, Get, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ModerateReviewDto } from './dto/moderate-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../generated/prisma/client';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.STAFF)
export class AdminReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Get()
    findAll(@Query('status') status?: string) {
        return this.reviewsService.findAll(status);
    }

    @Patch(':id/moderate')
    moderate(@Param('id') id: string, @Body() dto: ModerateReviewDto) {
        return this.reviewsService.moderate(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewsService.remove(id);
    }
}
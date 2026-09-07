import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller()
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    // Public — approved reviews for a given tour
    @Get('tours/:tourId/reviews')
    findApprovedForTour(@Param('tourId') tourId: string) {
        return this.reviewsService.findApprovedForTour(tourId);
    }

    // Requires login — only a registered customer can submit a review
    // (guest bookings can't review, since there's no account to attribute it to)
    @UseGuards(JwtAuthGuard)
    @Post('reviews')
    create(@CurrentUser('id') userId: string, @Body() dto: CreateReviewDto) {
        return this.reviewsService.create(userId, dto);
    }
}
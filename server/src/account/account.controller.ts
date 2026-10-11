import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
    constructor(private accountService: AccountService) { }

    @Get('bookings')
    getBookings(@CurrentUser('id') userId: string) {
        return this.accountService.getBookings(userId);
    }

    @Get('bookings/:id')
    getBooking(@CurrentUser('id') userId: string, @Param('id') id: string) {
        return this.accountService.getBooking(userId, id);
    }

    @Get('payments')
    getPayments(@CurrentUser('id') userId: string) {
        return this.accountService.getPayments(userId);
    }

    @Get('reviews')
    getReviews(@CurrentUser('id') userId: string) {
        return this.accountService.getReviews(userId);
    }

    @Patch('profile')
    updateProfile(@CurrentUser('id') userId: string, @Body() dto: UpdateProfileDto) {
        return this.accountService.updateProfile(userId, dto);
    }

    @Patch('password')
    changePassword(@CurrentUser('id') userId: string, @Body() dto: ChangePasswordDto) {
        return this.accountService.changePassword(userId, dto);
    }
}
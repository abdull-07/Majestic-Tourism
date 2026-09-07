import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
    constructor(private wishlistService: WishlistService) { }

    @Get()
    findAll(@CurrentUser('id') userId: string) {
        return this.wishlistService.findAllForUser(userId);
    }

    @Post()
    add(@CurrentUser('id') userId: string, @Body() dto: AddWishlistItemDto) {
        return this.wishlistService.add(userId, dto);
    }

    @Delete(':tourId')
    remove(@CurrentUser('id') userId: string, @Param('tourId') tourId: string) {
        return this.wishlistService.remove(userId, tourId);
    }
}
import { IsString } from 'class-validator';

export class AddWishlistItemDto {
    @IsString()
    tourId: string;
}
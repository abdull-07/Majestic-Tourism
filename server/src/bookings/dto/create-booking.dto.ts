import { IsString, IsInt, Min, IsOptional, IsEmail, ValidateIf } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    tourId: string;

    @IsString()
    availabilityId: string;

    @IsInt()
    @Min(1)
    adults: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    children?: number;

    @IsOptional()
    @IsString()
    couponCode?: string;

    // Guest fields — required only if the request has no auth token.
    // The controller checks req.user and enforces this at runtime;
    // these validators just make sure the shape is right when present.
    @ValidateIf((o) => !o.userId)
    @IsString()
    guestName?: string;

    @ValidateIf((o) => !o.userId)
    @IsEmail()
    guestEmail?: string;

    @ValidateIf((o) => !o.userId)
    @IsString()
    guestPhone?: string;
}
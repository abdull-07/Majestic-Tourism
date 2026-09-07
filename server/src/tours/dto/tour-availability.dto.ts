import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateAvailabilityDto {
    @IsDateString()
    departureDate: string;

    @IsInt()
    @Min(1)
    totalSeats: number;
}

export class UpdateAvailabilityDto {
    @IsDateString()
    departureDate: string;

    @IsInt()
    @Min(1)
    totalSeats: number;
}
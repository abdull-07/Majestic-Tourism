import { IsString, IsInt, Min, MinLength } from 'class-validator';

export class CreateItineraryDayDto {
    @IsInt()
    @Min(1)
    dayNumber: number;

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(10)
    description: string;
}

export class UpdateItineraryDayDto {
    @IsInt()
    @Min(1)
    dayNumber: number;

    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(10)
    description: string;
}
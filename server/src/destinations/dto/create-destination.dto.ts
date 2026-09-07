import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';

export class CreateDestinationDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(20, { message: 'Description should be at least 20 characters' })
    description: string;

    @IsOptional()
    @IsString()
    coverImage?: string;

    @IsOptional()
    @IsString()
    bestTimeToVisit?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
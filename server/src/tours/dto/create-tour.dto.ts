import {
    IsString, IsOptional, IsBoolean, IsEnum, IsInt, IsNumber,
    Min, MinLength, IsArray,
} from 'class-validator';
import { TourCategory, DifficultyLevel } from '../../generated/prisma/client';

export class CreateTourDto {
    @IsString()
    @MinLength(3)
    title: string;

    @IsString()
    @MinLength(20, { message: 'Description should be at least 20 characters' })
    description: string;

    @IsString()
    destinationId: string;

    @IsEnum(TourCategory)
    category: TourCategory;

    @IsOptional()
    @IsEnum(DifficultyLevel)
    difficultyLevel?: DifficultyLevel;

    @IsInt()
    @Min(1)
    durationDays: number;

    @IsInt()
    @Min(0)
    durationNights: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    minGroupSize?: number;

    @IsInt()
    @Min(1)
    maxGroupSize: number;

    @IsNumber()
    @Min(0)
    basePrice: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    childPrice?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    inclusions?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    exclusions?: string[];

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsString()
    metaTitle?: string;

    @IsOptional()
    @IsString()
    metaDescription?: string;
}
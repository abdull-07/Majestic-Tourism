import { IsInt, Min, Max, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    bookingId: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    @MinLength(10, { message: 'Review comment should be at least 10 characters' })
    comment: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];
}
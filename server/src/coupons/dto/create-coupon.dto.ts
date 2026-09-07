import {
    IsString, IsEnum, IsNumber, Min, IsOptional, IsInt, IsDateString, IsBoolean,
} from 'class-validator';
import { DiscountType } from '../../generated/prisma/client';

export class CreateCouponDto {
    @IsString()
    code: string;

    @IsEnum(DiscountType)
    discountType: DiscountType;

    @IsNumber()
    @Min(0)
    discountValue: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    minAmount?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    maxUses?: number;

    @IsDateString()
    validFrom: string;

    @IsDateString()
    validTo: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
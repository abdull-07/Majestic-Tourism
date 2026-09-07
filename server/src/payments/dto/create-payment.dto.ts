import { IsEnum, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../../generated/prisma/client';

export class CreatePaymentDto {
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsNumber()
    @Min(1)
    amount: number;

    @IsOptional()
    @IsString()
    transactionRef?: string;

    // Temporary plain URL field, same pattern as cover images —
    // will be replaced once the Cloudinary upload module exists.
    @IsOptional()
    @IsString()
    proofUrl?: string;
}
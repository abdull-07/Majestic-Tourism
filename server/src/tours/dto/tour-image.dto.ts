import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class AddTourImageDto {
    @IsString()
    url: string;

    @IsString()
    publicId: string;

    @IsOptional()
    @IsBoolean()
    isCover?: boolean;
}
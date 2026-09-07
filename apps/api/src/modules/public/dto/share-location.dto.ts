// apps/api/src/modules/public/dto/share-location.dto.ts
import { IsLatitude, IsLongitude, IsOptional, IsString, MaxLength } from 'class-validator';

export class ShareLocationDto {
    @IsLatitude()
    latitude: number;

    @IsLongitude()
    longitude: number;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    message?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    finderName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    finderPhone?: string;
}
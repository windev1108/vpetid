import {
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

import { PetGender, WeightUnit } from 'src/generated/prisma/client';

export class CreatePetDto {
    @IsString()
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    species?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    breed?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    color?: string;

    @IsOptional()
    @IsEnum(PetGender)
    gender?: PetGender;

    @IsOptional()
    @IsDateString()
    birthDate?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsOptional()
    @IsString()
    coverUrl?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    weight?: string;

    @IsEnum(WeightUnit)
    @IsOptional()
    weightUnit?: string;

    @IsOptional()
    @IsNumber()
    microchipNumber?: number;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    existingTagId?: string;
}
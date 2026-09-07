import {
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    zaloNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    whatAppsNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    facebookLink?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    avatarUrl?: string;
}
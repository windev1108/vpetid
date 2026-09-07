import {
    ArrayMinSize,
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

import { ReminderChannel } from 'src/generated/prisma/client';

export class UpdateHealthReminderDto {
    @IsOptional()
    @IsBoolean()
    enabled?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(365)
    remindBeforeDays?: number;

    @IsOptional()
    @IsArray()
    @IsEnum(ReminderChannel, {
        each: true,
    })
    channels?: ReminderChannel[];

    @IsOptional()
    @IsString()
    timezone?: string;
}
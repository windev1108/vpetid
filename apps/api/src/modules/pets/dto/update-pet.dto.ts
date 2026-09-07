import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdatePetDto extends PartialType(CreatePetDto) {
    @IsOptional()
    @IsNumber()
    @Min(0)
    weightGoal?: number;
}
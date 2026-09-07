import { Module } from '@nestjs/common';

import { PetsController } from './pets.controller';
import { PetsService } from './pets.service';
import { PetAccessGuard } from './guards/pet-access.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';
import { HealthService } from '../health/health.service';

@Module({
    controllers: [PetsController],

    providers: [
        PetsService,
        PetAccessGuard,
        CloudinaryService,
        CloudinaryProvider,
    ],

    exports: [
        PetsService,
        PetAccessGuard,
        CloudinaryService
    ],
})
export class PetsModule { }
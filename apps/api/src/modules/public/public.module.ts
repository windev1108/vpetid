import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { PetsService } from '../pets/pets.service';
import { PublicService } from './public.service';
import { MailService } from '../mail/mail.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryProvider } from '../cloudinary/cloudinary.provider';


@Module({
    controllers: [PublicController],

    providers: [
        PetsService,
        PublicService,
        MailService,
        CloudinaryService,
        CloudinaryProvider
    ],

    exports: [
        PetsService,
        PublicService
    ],
})
export class PublicModule { }
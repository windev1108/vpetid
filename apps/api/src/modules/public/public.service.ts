import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ShareLocationDto } from './dto/share-location.dto';

@Injectable()
export class PublicService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailService: MailService,
    ) { }
    async shareLocation(petId: string, dto: ShareLocationDto) {
        const pet = await this.prisma.pet.findUnique({
            where: { petCode: petId },
            select: {
                id: true,
                name: true,
                petCode: true,
                memberships: {
                    where: { status: 'ACTIVE' },
                    select: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });

        if (!pet) {
            throw new NotFoundException({
                code: 'PET_NOT_FOUND',
                message: 'Pet not found.',
            });
        }

        const recipientEmails = pet.memberships
            .map((m) => m.user.email)
            .filter((email): email is string => !!email);

        await this.mailService.sendPetLocationShared(recipientEmails, {
            petName: pet.name,
            petCode: pet.petCode,
            latitude: dto.latitude,
            longitude: dto.longitude,
            message: dto.message,
            finderName: dto.finderName,
            finderPhone: dto.finderPhone,
        });

        return { success: true };
    }
}
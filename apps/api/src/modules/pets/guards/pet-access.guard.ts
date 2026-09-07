import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

export type PetAccessRole =
    | 'OWNER'
    | 'CO_OWNER'
    | 'FAMILY'
    | 'CARETAKER'
    | 'VIEWER'
    | 'ADMIN'

@Injectable()
export class PetAccessGuard implements CanActivate {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const user = request.user;

        if (user.role === 'ADMIN') {
            return true;
        }

        if (!user?.id) {
            throw new UnauthorizedException(
                'Authentication required.',
            );
        }

        const petId =
            request.params?.id ??
            request.params?.petId;

        if (!petId) {
            throw new ForbiddenException(
                'Pet ID is required.',
            );
        }

        const membership =
            await this.prisma.petMembership.findUnique({
                where: {
                    petId_userId: {
                        petId,
                        userId: user.id,
                    },
                },
            });

        if (!membership) {
            throw new ForbiddenException(
                'You do not have access to this pet.',
            );
        }

        if (membership.status !== 'ACTIVE') {
            throw new ForbiddenException(
                'Your membership for this pet is not active.',
            );
        }

        // Make membership available to controllers/services.
        request.petMembership = membership;

        return true;
    }
}
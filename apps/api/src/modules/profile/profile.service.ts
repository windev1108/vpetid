import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    private readonly profileSelect = {
        id: true,

        email: true,

        firstName: true,
        lastName: true,
        avatarUrl: true,

        phoneNumber: true,
        zaloNumber: true,
        whatAppsNumber: true,

        role: true,
        status: true,

        emailVerifiedAt: true,
        phoneVerifiedAt: true,

        createdAt: true,
        updatedAt: true,
    } as const;

    async getProfile(userId: string) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },

                select: this.profileSelect,
            });

        if (!user) {
            throw new UnauthorizedException({
                code: 'INVALID_USER',
                message: 'User not found.',
            });
        }

        return user;
    }

    async updateProfile(
        userId: string,
        dto: UpdateProfileDto,
    ) {
        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },

                select: {
                    id: true,
                },
            });

        if (!user) {
            throw new UnauthorizedException({
                code: 'INVALID_USER',
                message: 'User not found.',
            });
        }

        return this.prisma.user.update({
            where: {
                id: userId,
            },

            data: {
                ...(dto.firstName !== undefined && {
                    firstName:
                        dto.firstName.trim(),
                }),

                ...(dto.lastName !== undefined && {
                    lastName:
                        dto.lastName.trim(),
                }),

                ...(dto.phoneNumber !== undefined && {
                    phoneNumber:
                        dto.phoneNumber.trim() || null,
                }),

                ...(dto.zaloNumber !== undefined && {
                    zaloNumber:
                        dto.zaloNumber.trim() || null,
                }),

                ...(dto.whatAppsNumber !== undefined && {
                    whatAppsNumber:
                        dto.whatAppsNumber.trim() || null,
                }),
            },

            select: this.profileSelect,
        });
    }
}
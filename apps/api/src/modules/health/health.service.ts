import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { UpdateHealthReminderDto } from './dto/update-health-reminder.dto';

@Injectable()
export class HealthService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    private async getMembership(
        userId: string,
        petId: string,
    ) {
        const membership =
            await this.prisma.petMembership.findUnique({
                where: {
                    petId_userId: {
                        petId,
                        userId,
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

        return membership;
    }

    private async assertCanManage(
        userId: string,
        petId: string,
    ) {
        const membership =
            await this.getMembership(
                userId,
                petId,
            );

        const user =
            await this.prisma.user.findUnique({
                where: {
                    id: userId,
                },
                select: {
                    role: true,
                },
            });

        if (!user) {
            throw new ForbiddenException(
                'User not found.',
            );
        }

        const canManage =
            membership.role === 'OWNER' ||
            membership.role === 'CO_OWNER' ||
            user.role === 'ADMIN';

        if (!canManage) {
            throw new ForbiddenException(
                'You do not have permission to manage this pet health data.',
            );
        }

        return membership;
    }

    // ============================================================
    // HEALTH OVERVIEW
    // ============================================================

    async getOverview(
        userId: string,
        petId: string,
    ) {
        await this.getMembership(
            userId,
            petId,
        );

        const now = new Date();

        const [
            total,
            completed,
            upcoming,
            overdue,
            upcomingVaccinations,
            historyVaccinations,
            reminder,
        ] = await Promise.all([
            this.prisma.petVaccination.count({
                where: {
                    petId,
                },
            }),

            this.prisma.petVaccination.count({
                where: {
                    petId,
                    status: 'COMPLETED',
                    OR: [
                        {
                            nextDueAt: null,
                        },
                        {
                            nextDueAt: {
                                gte: now,
                            },
                        },
                    ],
                },
            }),

            this.prisma.petVaccination.count({
                where: {
                    petId,
                    status: 'SCHEDULED',
                    nextDueAt: {
                        gte: now,
                    },
                },
            }),

            this.prisma.petVaccination.count({
                where: {
                    petId,
                    OR: [
                        {
                            status: 'MISSED',
                        },
                        {
                            status: 'SCHEDULED',
                            nextDueAt: {
                                lt: now,
                            },
                        },
                    ],
                },
            }),

            this.prisma.petVaccination.findMany({
                where: {
                    petId,
                    OR: [
                        {
                            status: 'MISSED',
                        },
                        {
                            status: 'SCHEDULED',
                        },
                    ],
                },

                select: {
                    id: true,
                    petId: true,
                    vaccineName: true,
                    status: true,
                    administeredAt: true,
                    nextDueAt: true,
                    veterinarian: true,
                    clinic: true,
                    manufacturer: true,
                },

                orderBy: {
                    nextDueAt: 'asc',
                },

                take: 5,
            }),

            this.prisma.petVaccination.findMany({
                where: {
                    petId,
                    status: {
                        in: [
                            'COMPLETED',
                            'CANCELLED',
                        ],
                    },
                },

                select: {
                    id: true,
                    petId: true,
                    vaccineName: true,
                    status: true,
                    administeredAt: true,
                    nextDueAt: true,
                    veterinarian: true,
                    clinic: true,
                    manufacturer: true,
                    notes: true,
                },

                orderBy: {
                    administeredAt: 'desc',
                },

                take: 5,
            }),

            this.getOrCreateReminder(
                petId,
            ),
        ]);

        return {
            summary: {
                upToDate: completed,
                upcoming,
                overdue,
                total,
            },

            upcoming:
                upcomingVaccinations.map(
                    (item) => ({
                        ...item,
                        displayStatus:
                            this.getDisplayStatus(
                                item.status,
                                item.nextDueAt,
                            ),
                    }),
                ),

            history:
                historyVaccinations.map(
                    (item) => ({
                        ...item,
                        displayStatus:
                            item.status,
                    }),
                ),

            reminder,
        };
    }

    private getDisplayStatus(
        status: string,
        nextDueAt: Date | null,
    ) {
        if (
            status === 'SCHEDULED' &&
            nextDueAt &&
            nextDueAt < new Date()
        ) {
            return 'OVERDUE';
        }

        return status;
    }

    // ============================================================
    // REMINDER
    // ============================================================

    private async getOrCreateReminder(
        petId: string,
    ) {
        return this.prisma.healthReminderConfig.upsert({
            where: {
                petId,
            },

            create: {
                petId,
                enabled: true,
                remindBeforeDays: 7,
                channels: [
                    'IN_APP',
                    'PUSH',
                    'EMAIL',
                ],
                timezone:
                    'Asia/Ho_Chi_Minh',
            },

            update: {},

            select: {
                id: true,
                petId: true,
                enabled: true,
                remindBeforeDays: true,
                channels: true,
                timezone: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getReminder(
        userId: string,
        petId: string,
    ) {
        await this.getMembership(
            userId,
            petId,
        );

        return this.getOrCreateReminder(
            petId,
        );
    }

    async updateReminder(
        userId: string,
        petId: string,
        dto: UpdateHealthReminderDto,
    ) {
        await this.assertCanManage(
            userId,
            petId,
        );

        return this.prisma.healthReminderConfig.upsert({
            where: {
                petId,
            },

            create: {
                petId,

                enabled:
                    dto.enabled ??
                    true,

                remindBeforeDays:
                    dto.remindBeforeDays ??
                    7,

                channels:
                    dto.channels ?? [
                        'IN_APP',
                        'PUSH',
                        'EMAIL',
                    ],

                timezone:
                    dto.timezone ??
                    'Asia/Ho_Chi_Minh',
            },

            update: {
                ...(dto.enabled !==
                    undefined && {
                    enabled:
                        dto.enabled,
                }),

                ...(dto.remindBeforeDays !==
                    undefined && {
                    remindBeforeDays:
                        dto.remindBeforeDays,
                }),

                ...(dto.channels !==
                    undefined && {
                    channels:
                        dto.channels,
                }),

                ...(dto.timezone !==
                    undefined && {
                    timezone:
                        dto.timezone,
                }),
            },

            select: {
                id: true,
                petId: true,
                enabled: true,
                remindBeforeDays: true,
                channels: true,
                timezone: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    // ============================================================
    // VACCINATIONS
    // ============================================================

    async createVaccination(
        userId: string,
        petId: string,
        dto: {
            vaccineName: string;
            status?:
                | 'SCHEDULED'
                | 'COMPLETED'
                | 'MISSED'
                | 'CANCELLED';

            administeredAt?: string;
            nextDueAt?: string;
            veterinarian?: string;
            clinic?: string;
            batchNumber?: string;
            manufacturer?: string;
            notes?: string;
        },
    ) {
        await this.assertCanManage(
            userId,
            petId,
        );

        const vaccineName =
            dto.vaccineName?.trim();

        if (!vaccineName) {
            throw new BadRequestException(
                'Vaccine name is required.',
            );
        }

        return this.prisma.petVaccination.create({
            data: {
                petId,
                vaccineName,

                status:
                    dto.status ??
                    'SCHEDULED',

                ...(dto.administeredAt && {
                    administeredAt:
                        new Date(
                            dto.administeredAt,
                        ),
                }),

                ...(dto.nextDueAt && {
                    nextDueAt:
                        new Date(
                            dto.nextDueAt,
                        ),
                }),

                ...(dto.veterinarian && {
                    veterinarian:
                        dto.veterinarian.trim(),
                }),

                ...(dto.clinic && {
                    clinic:
                        dto.clinic.trim(),
                }),

                ...(dto.batchNumber && {
                    batchNumber:
                        dto.batchNumber.trim(),
                }),

                ...(dto.manufacturer && {
                    manufacturer:
                        dto.manufacturer.trim(),
                }),

                ...(dto.notes && {
                    notes:
                        dto.notes.trim(),
                }),
            },
        });
    }

    async updateVaccination(
        userId: string,
        petId: string,
        vaccinationId: string,
        dto: {
            vaccineName?: string;
            status?:
                | 'SCHEDULED'
                | 'COMPLETED'
                | 'MISSED'
                | 'CANCELLED';

            administeredAt?: string | null;
            nextDueAt?: string | null;
            veterinarian?: string;
            clinic?: string;
            batchNumber?: string;
            manufacturer?: string;
            notes?: string;
        },
    ) {
        await this.assertCanManage(
            userId,
            petId,
        );

        const existing =
            await this.prisma.petVaccination.findFirst({
                where: {
                    id: vaccinationId,
                    petId,
                },
            });

        if (!existing) {
            throw new NotFoundException(
                'Vaccination record not found.',
            );
        }

        return this.prisma.petVaccination.update({
            where: {
                id: vaccinationId,
            },

            data: {
                ...(dto.vaccineName !==
                    undefined && {
                    vaccineName:
                        dto.vaccineName.trim(),
                }),

                ...(dto.status !==
                    undefined && {
                    status: dto.status,
                }),

                ...(dto.administeredAt !==
                    undefined && {
                    administeredAt:
                        dto.administeredAt
                            ? new Date(
                                  dto.administeredAt,
                              )
                            : null,
                }),

                ...(dto.nextDueAt !==
                    undefined && {
                    nextDueAt:
                        dto.nextDueAt
                            ? new Date(
                                  dto.nextDueAt,
                              )
                            : null,
                }),

                ...(dto.veterinarian !==
                    undefined && {
                    veterinarian:
                        dto.veterinarian.trim(),
                }),

                ...(dto.clinic !==
                    undefined && {
                    clinic:
                        dto.clinic.trim(),
                }),

                ...(dto.batchNumber !==
                    undefined && {
                    batchNumber:
                        dto.batchNumber.trim(),
                }),

                ...(dto.manufacturer !==
                    undefined && {
                    manufacturer:
                        dto.manufacturer.trim(),
                }),

                ...(dto.notes !==
                    undefined && {
                    notes:
                        dto.notes.trim(),
                }),
            },
        });
    }

    async deleteVaccination(
        userId: string,
        petId: string,
        vaccinationId: string,
    ) {
        await this.assertCanManage(
            userId,
            petId,
        );

        const existing =
            await this.prisma.petVaccination.findFirst({
                where: {
                    id: vaccinationId,
                    petId,
                },
            });

        if (!existing) {
            throw new NotFoundException(
                'Vaccination record not found.',
            );
        }

        await this.prisma.petVaccination.delete({
            where: {
                id: vaccinationId,
            },
        });

        return {
            success: true,
            message:
                'Vaccination deleted successfully.',
        };
    }
}
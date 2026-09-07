import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
    HttpException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { randomBytes } from 'node:crypto';
import { Prisma, WeightUnit } from 'src/generated/prisma/client';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { extractCloudinaryPublicId } from 'src/lib/utils';
import { CreatePetNoteDto } from './dto/create-pet-note.dto';

@Injectable()
export class PetsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    async getOverview(userId: string, petCode: string) {
        const pet = await this.prisma.pet.findUnique({
            where: {
                petCode,
            },
            select: {
                id: true,
                weightGoal: true,
            },
        });

        if (!pet) {
            throw new NotFoundException('Pet not found.');
        }

        await this.getMembership(userId, pet.id);

        const [nextVaccination, notes] =
            await Promise.all([
                this.prisma.petVaccination.findFirst({
                    where: {
                        petId: pet.id,
                        status: 'SCHEDULED',
                        nextDueAt: {
                            not: null,
                        },
                    },
                    select: {
                        id: true,
                        vaccineName: true,
                        nextDueAt: true,
                        status: true,
                    },
                    orderBy: {
                        nextDueAt: 'asc',
                    },
                }),

                this.prisma.petNote.findMany({
                    where: {
                        petId: pet.id,
                    },
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 10,
                }),
            ]);

        return {
            weightGoal: pet.weightGoal
                ? Number(pet.weightGoal)
                : null,

            nextVaccination,

            notes,
        };
    }

    /**
     * Check whether a user has access to a pet.
     */
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

    async createNote(
        userId: string,
        petCode: string,
        dto: CreatePetNoteDto,
    ) {
        const pet = await this.prisma.pet.findUnique({
            where: {
                petCode,
            },
            select: {
                id: true,
            },
        });

        if (!pet) {
            throw new NotFoundException('Pet not found.');
        }

        await this.getMembership(
            userId,
            pet.id,
        );

        return this.prisma.petNote.create({
            data: {
                petId: pet.id,
                title: dto.title.trim(),
                content: dto.content.trim(),
            },
        });
    }

    /**
     * Create a new pet.
     *
     * The authenticated user automatically becomes OWNER.
     */
    async create(
        userId: string,
        dto: CreatePetDto,
    ) {
        if (!userId) {
            throw new UnauthorizedException(
                'Authenticated user ID is missing.',
            );
        }

        return this.createPetWithUniqueCode(
            userId,
            dto,
        );
    }


    private async createPetWithUniqueCode(
        userId: string,
        dto: CreatePetDto,
    ) {
        for (let attempt = 0; attempt < 5; attempt++) {
            const petCode =
                await this.generateUniquePetCode();

            try {
                return await this.prisma.pet.create({
                    data: {
                        petCode,
                        name: dto.name.trim(),

                        ...(dto.species !== undefined && {
                            species: dto.species.trim(),
                        }),

                        ...(dto.weight !== undefined && {
                            weight: dto.weight,
                        }),

                        ...(dto.color !== undefined && {
                            color: dto.color,
                        }),

                        ...(dto.microchipNumber !== undefined && {
                            microchipNumber: dto.microchipNumber,
                        }),

                        ...(dto.existingTagId !== undefined && {
                            existingTagId: dto.existingTagId,
                        }),

                        ...(dto.breed !== undefined && {
                            breed: dto.breed.trim(),
                        }),

                        ...(dto.gender !== undefined && {
                            gender: dto.gender,
                        }),

                        ...(dto.birthDate !== undefined && {
                            dateOfBirth:
                                new Date(dto.birthDate),
                        }),

                        ...(dto.avatarUrl !== undefined && {
                            avatarUrl: dto.avatarUrl,
                        }),
                        ...(dto.coverUrl !== undefined && {
                            coverUrl: dto.coverUrl,
                        }),
                        ...(dto.description !== undefined && {
                            description:
                                dto.description.trim(),
                        }),

                        memberships: {
                            create: {
                                userId,
                                role: 'OWNER',
                                status: 'ACTIVE',
                            },
                        },
                    },

                    include: {
                        memberships: {
                            where: {
                                userId,
                            },
                        },
                    },
                });
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002'
                ) {
                    continue;
                }

                throw error;
            }
        }

        throw new ConflictException(
            'Unable to generate a unique Pet ID.',
        );
    }

    /**
     * Get all pets accessible by the current user.
     */
    async findMine(userId: string) {
        return this.prisma.pet.findMany({
            where: {
                memberships: {
                    some: {
                        userId,
                        status: 'ACTIVE',
                    },
                },
            },

            include: {
                memberships: {
                    where: {
                        userId,
                    },
                },

                microchip: true,

                identities: true,

                devices: {
                    select: {
                        id: true,
                        deviceId: true,
                        status: true,
                        lastSeenAt: true,
                    },
                },
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Get a single pet.
     */
    async findOne(
        userId: string,
        petId: string,
    ) {

        const pet = await this.prisma.pet.findUnique({
            where: {
                petCode: petId,
            },

            include: {
                memberships: {
                    where: {
                        status: 'ACTIVE',
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },

                microchip: true,

                identities: true,

                devices: {
                    select: {
                        id: true,
                        deviceId: true,
                        serialNumber: true,
                        status: true,
                        lastSeenAt: true,
                    },
                },

                geofences: true,
            },
        });
        await this.getMembership(userId, pet?.id);

        if (!pet) {
            throw new NotFoundException(
                'Pet not found.',
            );
        }

        return pet;
    }

    async findOnePublic(
        petId: string,
    ) {

        const pet = await this.prisma.pet.findUnique({
            where: {
                petCode: petId,
            },

            include: {
                memberships: {
                    where: {
                        status: 'ACTIVE',
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                avatarUrl: true,
                                zaloNumber: true,
                                whatAppsNumber: true,
                                phoneNumber: true,
                            },
                        },
                    },
                },

                microchip: true,

                identities: true,

                devices: {
                    select: {
                        id: true,
                        deviceId: true,
                        serialNumber: true,
                        status: true,
                        lastSeenAt: true,
                    },
                },

                geofences: true,
            },
        });

        if (!pet || !pet.isPublicProfile) {
            throw new NotFoundException(
                'Pet not found.',
            );
        }

        return { ...pet, superOwner: pet.memberships[0] ?? null };
    }

    /**
     * Update pet information.
     */

    async togglePublicProfile(
        userId: string,
        petId: string
    ){
        const membership =
            await this.getMembership(
                userId,
                petId,
            );

        const user = await this.prisma.user.findFirst({ where: { id: userId } })
        if (
            membership.role !== 'OWNER' &&
            membership.role !== 'CO_OWNER' &&
            user.role !== 'ADMIN'
        ) {
            throw new ForbiddenException(
                'You do not have permission to update this pet.',
            );
        }

        const pet = await this.prisma.pet.findUnique({
            where: {
                id: petId,
            },
        });

        const petUpdated = await this.prisma.pet.update({
            where: {
                id: petId
            },
            data: {
                isPublicProfile: !pet?.isPublicProfile
            }
        })

        return petUpdated
    }

    async update(
        userId: string,
        petId: string,
        dto: UpdatePetDto,
    ) {
        const membership =
            await this.getMembership(
                userId,
                petId,
            );

        const user = await this.prisma.user.findFirst({ where: { id: userId } })
        if (
            membership.role !== 'OWNER' &&
            membership.role !== 'CO_OWNER' &&
            user.role !== 'ADMIN'
        ) {
            throw new ForbiddenException(
                'You do not have permission to update this pet.',
            );
        }

        const pet = await this.prisma.pet.findUnique({
            where: {
                id: petId,
            },
        });

        if (
            pet.avatarUrl &&
            dto.avatarUrl &&
            pet.avatarUrl !== dto.avatarUrl
        ) {
            const publicId = extractCloudinaryPublicId(pet.avatarUrl);

            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
                console.log('Deleted old avatar:', publicId);
            }
        }

        if (
            pet.coverUrl &&
            dto.coverUrl &&
            pet.coverUrl !== dto.coverUrl
        ) {
            const publicId = extractCloudinaryPublicId(pet.coverUrl);

            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
                console.log('Deleted old cover:', publicId);
            }
        }

        if (!pet) {
            throw new NotFoundException(
                'Pet not found.',
            );
        }

        return this.prisma.pet.update({
            where: {
                id: petId,
            },

            data: {
                ...(dto.name !== undefined && {
                    name: dto.name.trim(),
                }),
                ...(dto.weight !== undefined && {
                    weight: dto.weight,
                }),

                ...(dto.color !== undefined && {
                    color: dto.color,
                }),

                ...(dto.weightUnit !== undefined && {
                    weightUnit: dto.weightUnit as WeightUnit,
                }),

                ...(dto.microchipNumber !== undefined && {
                    microchipNumber: dto.microchipNumber,
                }),

                ...(dto.existingTagId !== undefined && {
                    existingTagId: dto.existingTagId,
                }),

                ...(dto.species !== undefined && {
                    species: dto.species.trim(),
                }),

                ...(dto.breed !== undefined && {
                    breed: dto.breed.trim(),
                }),

                ...(dto.gender !== undefined && {
                    gender: dto.gender,
                }),

                ...(dto.birthDate !== undefined && {
                    dateOfBirth: new Date(dto.birthDate),
                }),

                ...(dto.avatarUrl !== undefined && {
                    avatarUrl: dto.avatarUrl,
                }),

                ...(dto.coverUrl !== undefined && {
                    coverUrl: dto.coverUrl,
                }),

                ...(dto.description !== undefined && {
                    description: dto.description.trim(),
                }),

                ...(dto.weightGoal !== undefined && {
                    weightGoal: dto.weightGoal,
                }),
            },
        });
    }

    /**
     * Delete a pet.
     *
     * Only OWNER can delete a pet.
     */
    async remove(
        userId: string,
        petId: string,
    ) {
        const membership =
            await this.getMembership(
                userId,
                petId,
            );

        if (membership.role !== 'OWNER') {
            throw new ForbiddenException(
                'Only the pet owner can delete this pet.',
            );
        }

        const pet = await this.prisma.pet.findUnique({
            where: {
                id: petId,
            },
        });

        if (!pet) {
            throw new NotFoundException(
                'Pet not found.',
            );
        }

        if (pet.avatarUrl) {
            const publicId = extractCloudinaryPublicId(pet.avatarUrl);

            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
                console.log('Deleted old avatar:', publicId);
            }
        }
        if (pet.coverUrl) {
            const publicId = extractCloudinaryPublicId(pet.coverUrl);

            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
                console.log('Deleted old cover:', publicId);
            }
        }

        await this.prisma.pet.delete({
            where: {
                id: petId,
            },
        });

        return {
            success: true,
            message: 'Pet deleted successfully.',
        };
    }

    private generatePetCode(): string {
        const chars =
            'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

        let code = '';

        for (let i = 0; i < 8; i++) {
            code += chars[
                randomBytes(1)[0] % chars.length
            ];
        }

        return `VP-${code}`;
    }

    private async generateUniquePetCode(): Promise<string> {
        const MAX_ATTEMPTS = 10;

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
            const petCode = this.generatePetCode();

            const existing =
                await this.prisma.pet.findUnique({
                    where: {
                        petCode,
                    },
                    select: {
                        id: true,
                    },
                });

            if (!existing) {
                return petCode;
            }
        }

        throw new ConflictException(
            'Unable to generate a unique Pet ID. Please try again.',
        );
    }
}
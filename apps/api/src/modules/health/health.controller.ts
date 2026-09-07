import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

import { HealthService } from './health.service';

import { UpdateHealthReminderDto } from './dto/update-health-reminder.dto';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';


@Controller('pets/:petId/health')
@UseGuards(JwtAuthGuard)
export class HealthController {
    constructor(
        private readonly healthService: HealthService,
    ) { }

    @Get()
    getOverview(
        @CurrentUser() user: AuthenticatedUser,
        @Param('petId') petId: string,
    ) {
        return this.healthService.getOverview(
            user.userId,
            petId,
        );
    }

    // ============================================================
    // REMINDER
    // ============================================================

    @Get('reminder')
    getReminder(
        @CurrentUser() user: AuthenticatedUser,
        @Param('petId') petId: string,
    ) {
        return this.healthService.getReminder(
            user.userId,
            petId,
        );
    }

    @Patch('reminder')
    updateReminder(
        @CurrentUser() user: AuthenticatedUser,
        @Param('petId') petId: string,
        @Body()
        dto: UpdateHealthReminderDto,
    ) {
        return this.healthService.updateReminder(
            user.userId,
            petId,
            dto,
        );
    }

    // ============================================================
    // VACCINATIONS
    // ============================================================

    @Post('vaccinations')
    createVaccination(
        @CurrentUser() user: AuthenticatedUser,
        @Param('petId') petId: string,
        @Body() body: {
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
        return this.healthService.createVaccination(
            user.userId,
            petId,
            body,
        );
    }

    @Patch(
        'vaccinations/:vaccinationId',
    )
    updateVaccination(
        @CurrentUser() user: AuthenticatedUser,
        @Param('petId') petId: string,
        @Param('vaccinationId')
        vaccinationId: string,
        @Body() body: {
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
        return this.healthService.updateVaccination(
            user.userId,
            petId,
            vaccinationId,
            body,
        );
    }

    @Delete(
        'vaccinations/:vaccinationId',
    )
    deleteVaccination(
        @CurrentUser() user: AuthenticatedUser,
        @Param('petId') petId: string,
        @Param('vaccinationId')
        vaccinationId: string,
    ) {
        return this.healthService.deleteVaccination(
            user.userId,
            petId,
            vaccinationId,
        );
    }
}
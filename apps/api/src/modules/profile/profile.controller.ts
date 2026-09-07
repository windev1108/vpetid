import {
    Body,
    Controller,
    Get,
    HttpCode,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { Request, Response } from 'express';
import { getRefreshCookieOptions, GOOGLE_STATE_COOKIE, REFRESH_TOKEN_COOKIE } from 'src/lib/constants';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';


@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getProfile(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.profileService.getProfile(user.userId)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('/')
    async updateProfile(
        @Body() dto: UpdateProfileDto,
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return this.profileService.updateProfile(user.userId, dto)
    }
}
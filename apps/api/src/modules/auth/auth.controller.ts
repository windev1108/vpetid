import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    Query,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { Request, Response } from 'express';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { SessionService } from './services/session.service';
import { TokenService } from './services/token.service';

import { JwtAuthGuard } from './strategies/jwt-auth.guard';

import { CurrentUser } from './decorators/user.decorator';
import { AuthenticatedUser } from './strategies/jwt.strategy';
import { getRefreshCookieOptions, GOOGLE_STATE_COOKIE, REFRESH_TOKEN_COOKIE } from 'src/lib/constants';


@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly googleService: GoogleService,
        private readonly sessionService: SessionService,
        private readonly tokenService: TokenService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(
        @CurrentUser() user: AuthenticatedUser,
    ) {
        return {
            user,
        };
    }

    @Post('register')
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    async register(
        @Body() dto: RegisterDto,
    ) {
        return this.authService.register(dto);
    }

    @Post('login')
    @HttpCode(200)
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken, expiresAt, user } =
            await this.authService.login(dto);

        res.cookie(
            REFRESH_TOKEN_COOKIE,
            refreshToken,
            getRefreshCookieOptions(),
        );

        return { accessToken, expiresAt, user };
    }

    @Get('google')
    googleLogin(
        @Res() res: Response,
    ) {
        const state =
            this.googleService.generateState();

        const url =
            this.googleService.getAuthorizationUrl(
                state,
            );

        res.cookie(
            GOOGLE_STATE_COOKIE,
            state,
            {
                httpOnly: true,
                secure:
                    process.env.NODE_ENV ===
                    'production',
                sameSite: 'lax',
                maxAge:
                    10 * 60 * 1000,
            },
        );

        return res.redirect(url);
    }

    @Get('google/callback')
    async googleCallback(
        @Query('code') code: string,
        @Query('state') state: string,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const cookieState = req.cookies?.[GOOGLE_STATE_COOKIE];

        // Luôn clear state cookie sau khi dùng một lần, dù thành công hay thất bại.
        res.clearCookie(GOOGLE_STATE_COOKIE);

        if (!code || !state || !cookieState || state !== cookieState) {
            throw new UnauthorizedException({
                code: 'INVALID_OAUTH_STATE',
                message: 'Invalid or missing OAuth state.',
            });
        }

        const identity = await this.googleService.exchangeCode(code);

        const { accessToken, refreshToken, expiresAt } =
            await this.authService.loginWithGoogle(identity);

        res.cookie(
            REFRESH_TOKEN_COOKIE,
            refreshToken,
            getRefreshCookieOptions(),
        );

        // Redirect về FE kèm access token ngắn hạn qua query string.
        // FE nên đọc token này 1 lần rồi lưu vào memory, không lưu localStorage.
        const redirectUrl = new URL(
            process.env.OAUTH_SUCCESS_REDIRECT_URL ??
            'http://localhost:3000/oauth/success',
        );
        redirectUrl.searchParams.set('accessToken', accessToken);
        redirectUrl.searchParams.set('expiresAt', expiresAt.toISOString());

        return res.redirect(redirectUrl.toString());
    }

    @Post('refresh')
    @HttpCode(200)
    @Throttle({ default: { limit: 20, ttl: 60_000 } })
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

        if (!rawRefreshToken) {
            throw new UnauthorizedException({
                code: 'MISSING_REFRESH_TOKEN',
                message: 'Refresh token is missing.',
            });
        }

        const session = await this.sessionService.rotateSession(rawRefreshToken);
        const user = await this.authService.findUserById(session.userId);

        const accessToken = this.tokenService.signAccessToken({
            sub: user.id,
            email: user.email,
            sessionId: session.sessionId,
        });

        res.cookie(
            REFRESH_TOKEN_COOKIE,
            session.refreshToken,
            getRefreshCookieOptions(),
        );

        return { accessToken, expiresAt: session.expiresAt, user };
    }

    @Post('logout')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async logout(
        @CurrentUser() user: AuthenticatedUser,
        @Res({ passthrough: true }) res: Response,
    ) {
        if (user.sessionId) {
            await this.sessionService.revokeSession(user.sessionId);
        }

        res.clearCookie(REFRESH_TOKEN_COOKIE, { path: '/auth' });

        return { success: true };
    }
}
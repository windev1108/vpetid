import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from '../prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';

import { PasswordService } from './services/password.service';
import { SessionService } from './services/session.service';
import { TokenService } from './services/token.service';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        // JwtService dùng để sign access token; secret/expiresIn được set
        // trực tiếp trong TokenService.signAccessToken() mỗi lần gọi,
        // registerAsync ở đây chỉ để có JwtService khả dụng qua DI.
        JwtModule.register({}),
        // Cấu hình rate-limit mặc định; các route nhạy cảm override bằng @Throttle(...).
        ThrottlerModule.forRoot([
            {
                ttl: 60_000,
                limit: 30,
            },
        ]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        GoogleService,
        PasswordService,
        SessionService,
        TokenService,
        JwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule { }
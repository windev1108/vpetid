import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';
import {
    ExtractJwt,
    Strategy,
} from 'passport-jwt';
import { PrismaService } from 'src/modules/prisma/prisma.service';


export interface JwtPayload {
    sub: string;
    email: string;
    sessionId?: string;
}

// Đủ field để FE render thẳng (Navbar, Sidebar...), không cần map lại ở từng controller.
export interface AuthenticatedUser {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    sessionId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prisma: PrismaService) {
        const secret = process.env.JWT_ACCESS_SECRET;

        if (!secret) {
            throw new Error(
                'JWT_ACCESS_SECRET is not defined',
            );
        }

        super({
            jwtFromRequest:
                ExtractJwt.fromAuthHeaderAsBearerToken(),

            ignoreExpiration: false,

            secretOrKey: secret,
        });
    }

    async validate(
        payload: JwtPayload,
    ): Promise<AuthenticatedUser> {
        if (!payload.sub) {
            throw new UnauthorizedException(
                'Invalid access token',
            );
        }

        // Chạy trên mọi request có Bearer token hợp lệ, không chỉ /auth/me.
        // Nếu lo tốn query DB mỗi request, cân nhắc cache hoặc tách riêng
        // 1 decorator "nặng" chỉ dùng cho /auth/me thay vì đổi ở đây.
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
            },
        });

        if (!user) {
            // User đã bị xoá nhưng access token cũ vẫn còn hạn -> từ chối
            // thay vì cho qua với data rỗng.
            throw new UnauthorizedException(
                'User no longer exists',
            );
        }

        return {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            avatarUrl: user.avatarUrl,
            sessionId: payload.sessionId,
        };
    }
}
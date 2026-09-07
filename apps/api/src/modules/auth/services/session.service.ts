import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SessionService {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    private generateRefreshToken() {
        return randomBytes(32).toString('hex');
    }

    hashToken(token: string) {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }

    async createSession(userId: string) {
        const refreshToken = this.generateRefreshToken();
        const tokenHash = this.hashToken(refreshToken);

        const expiresAt = new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30,
        );

        const session = await this.prisma.refreshSession.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
            },
        });

        return {
            sessionId: session.id,
            refreshToken,
            expiresAt,
            userId,
        };
    }

    /**
     * Refresh token rotation: mỗi lần refresh, token cũ bị revoke ngay
     * và một token mới được phát hành. Nếu 1 token đã bị revoke mà vẫn
     * được dùng lại (reuse) -> dấu hiệu token đã bị đánh cắp, nên revoke
     * toàn bộ session của user đó để buộc đăng nhập lại.
     *
     * Lưu ý: field `revokedAt` cần được thêm vào model RefreshSession
     * trong Prisma schema (DateTime?, mặc định null).
     */
    async rotateSession(rawToken: string) {
        const tokenHash = this.hashToken(rawToken);

        const session = await this.prisma.refreshSession.findUnique({
            where: { tokenHash },
        });

        if (!session) {
            throw new UnauthorizedException({
                code: 'INVALID_REFRESH_TOKEN',
                message: 'Refresh token is invalid or expired.',
            });
        }

        if (session.revokedAt) {
            await this.revokeAllUserSessions(session.userId);
            throw new UnauthorizedException({
                code: 'REFRESH_TOKEN_REUSED',
                message: 'Refresh token reuse detected. All sessions revoked.',
            });
        }

        if (session.expiresAt < new Date()) {
            throw new UnauthorizedException({
                code: 'REFRESH_TOKEN_EXPIRED',
                message: 'Refresh token has expired.',
            });
        }

        await this.prisma.refreshSession.update({
            where: { id: session.id },
            data: { revokedAt: new Date() },
        });

        return this.createSession(session.userId);
    }

    async revokeSession(sessionId: string) {
        await this.prisma.refreshSession.updateMany({
            where: { id: sessionId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllUserSessions(userId: string) {
        await this.prisma.refreshSession.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
}
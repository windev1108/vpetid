import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleIdentity {
    sub: string;
    email: string;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    picture?: string;
}

@Injectable()
export class GoogleService {
    private readonly client: OAuth2Client;

    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

        if (!clientId || !clientSecret || !callbackUrl) {
            // Fail fast lúc khởi động app thay vì lỗi mơ hồ lúc runtime
            // khi user thực sự bấm "Login with Google".
            throw new Error(
                'Missing Google OAuth env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL',
            );
        }

        this.client = new OAuth2Client(clientId, clientSecret, callbackUrl);
    }

    generateState(): string {
        return randomBytes(32).toString('hex');
    }

    getAuthorizationUrl(state: string) {
        return this.client.generateAuthUrl({
            // Chỉ bật 'offline' nếu thực sự cần gọi lại Google API sau này
            // và có kế hoạch lưu (mã hoá) refresh token của Google.
            // Nếu chỉ cần đăng nhập, nên bỏ dòng này để giảm scope xin quyền.
            access_type: 'offline',
            scope: [
                'openid',
                'email',
                'profile',
            ],
            state,
            prompt: 'select_account',
        });
    }

    async exchangeCode(code: string) {
        const { tokens } = await this.client.getToken(code);

        if (!tokens.id_token) {
            throw new UnauthorizedException(
                'Google ID token was not returned',
            );
        }

        return this.verifyIdToken(tokens.id_token);
    }

    async verifyIdToken(idToken: string): Promise<GoogleIdentity> {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload?.sub || !payload.email) {
            throw new UnauthorizedException(
                'Invalid Google identity',
            );
        }

        return {
            sub: payload.sub,
            email: payload.email,
            emailVerified: payload.email_verified === true,
            firstName: payload.given_name,
            lastName: payload.family_name,
            picture: payload.picture,
        };
    }
}
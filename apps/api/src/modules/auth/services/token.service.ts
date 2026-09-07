import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export interface AccessTokenPayload {
    sub: string;
    email: string;
    sessionId: string;
}

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }

    signAccessToken(payload: AccessTokenPayload): string {
        const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN ?? '15m') as JwtSignOptions['expiresIn'];
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: expiresIn
        });
    }
}
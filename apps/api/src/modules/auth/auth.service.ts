import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';

import { PasswordService } from './services/password.service';
import { TokenService } from './services/token.service';

import { RegisterDto } from './dto/register.dto';

import { PrismaService } from '../prisma/prisma.service';

import { AccountProvider } from 'src/generated/prisma/enums';
import { GoogleIdentity } from './google.service';
import { SessionService } from './services/session.service';
import { LoginDto } from './dto/login.dto';
import { isAdminEmail } from 'src/config/admin.config';
import { User } from 'src/generated/prisma/client';

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly passwordService: PasswordService,
        private readonly sessionService: SessionService,
        private readonly tokenService: TokenService,
    ) { }

    async login(dto: LoginDto): Promise<AuthTokens & { user: Record<string, unknown> }> {
        const email = dto.email.trim().toLowerCase();

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.passwordHash) {
            // Vẫn chạy verify với dummy hash để giữ thời gian phản hồi
            // ổn định, tránh lộ việc email có tồn tại hay không qua timing.
            await this.passwordService.verifyDummy(dto.password);

            throw new UnauthorizedException({
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password.',
            });
        }

        const valid = await this.passwordService.verify(
            user.passwordHash,
            dto.password,
        );

        if (!valid) {
            throw new UnauthorizedException({
                code: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password.',
            });
        }

        const tokens = await this.issueTokens(user.id, user.email);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
            },
        };
    }

    async loginWithGoogle(identity: GoogleIdentity): Promise<AuthTokens> {
        if (!identity.emailVerified) {
            throw new UnauthorizedException(
                'Google email is not verified',
            );
        }

        const googleAccount =
            await this.prisma.account.findUnique({
                where: {
                    provider_providerAccountId: {
                        provider: AccountProvider.GOOGLE,
                        providerAccountId: identity.sub,
                    },
                },
                include: {
                    user: true,
                },
            });

        if (googleAccount) {
            const syncedUser = await this.syncUserFromGoogle(googleAccount.user, identity);
            return this.issueTokens(syncedUser.id, syncedUser.email);
        }

        return this.createGoogleUser(identity);
    }

    async findUserById(userId: string) {
        const user = await this.prisma.user.findUniqueOrThrow({
            where: { id: userId },
        });

        return user;
    }

    private async syncUserFromGoogle(user: User, identity: GoogleIdentity): Promise<User> {
        const incomingFirstName = identity.firstName ?? '';
        const incomingLastName = identity.lastName ?? '';
        const incomingAvatarUrl = identity.picture ?? null;

        const hasChanges =
            user.firstName !== incomingFirstName ||
            user.lastName !== incomingLastName ||
            user.avatarUrl !== incomingAvatarUrl;

        if (!hasChanges) {
            return user;
        }

        return this.prisma.user.update({
            where: { id: user.id },
            data: {
                firstName: incomingFirstName,
                lastName: incomingLastName,
                avatarUrl: incomingAvatarUrl,
            },
        });
    }

    private async issueTokens(userId: string, email: string): Promise<AuthTokens> {
        const session = await this.sessionService.createSession(userId);

        const accessToken = this.tokenService.signAccessToken({
            sub: userId,
            email,
            sessionId: session.sessionId,
        });

        return {
            accessToken,
            refreshToken: session.refreshToken,
            expiresAt: session.expiresAt,
        };
    }

    private async linkGoogleAccountIfMissing(userId: string, identity: GoogleIdentity) {
        const account = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: AccountProvider.GOOGLE,
                    providerAccountId: identity.sub,
                },
            },
        });

        if (!account) {
            await this.prisma.account.create({
                data: {
                    userId,
                    provider: AccountProvider.GOOGLE,
                    providerAccountId: identity.sub,
                },
            });
        }
    }

    private async createGoogleUser(
        identity: GoogleIdentity,
    ): Promise<AuthTokens> {
        const existingUser =
            await this.prisma.user.findUnique({
                where: {
                    email: identity.email,
                },
            });

        if (existingUser) {
            await this.linkGoogleAccountIfMissing(existingUser.id, identity);
            return this.issueTokens(existingUser.id, existingUser.email);
        }

        try {
            const role = isAdminEmail(identity.email)
                ? 'ADMIN'
                : 'USER';
            const user = await this.prisma.user.create({
                data: {
                    email: identity.email,
                    firstName: identity.firstName ?? '',
                    lastName: identity.lastName ?? '',
                    avatarUrl: identity.picture,
                    emailVerifiedAt: identity.emailVerified
                        ? new Date()
                        : null,
                    role,
                    accounts: {
                        create: {
                            provider: AccountProvider.GOOGLE,
                            providerAccountId: identity.sub,
                        },
                    },
                },
            });

            return this.issueTokens(user.id, user.email);
        } catch (error: any) {
            // Race condition: 2 request Google login đồng thời cho cùng 1 email mới
            // có thể cùng thấy existingUser = null rồi cùng cố tạo user.
            // Prisma trả P2002 (unique constraint violation) cho request thua cuộc.
            if (error?.code === 'P2002') {
                const user = await this.prisma.user.findUniqueOrThrow({
                    where: { email: identity.email },
                });

                await this.linkGoogleAccountIfMissing(user.id, identity);
                return this.issueTokens(user.id, user.email);
            }

            throw error;
        }
    }

    async register(dto: RegisterDto) {
        const email = dto.email.trim().toLowerCase();

        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingUser) {
            throw new ConflictException({
                code: 'EMAIL_ALREADY_EXISTS',
                message: 'Unable to create account with this email.',
            });
        }

        const passwordHash = await this.passwordService.hash(dto.password);

        try {
            const role = isAdminEmail(dto.email)
                ? 'ADMIN'
                : 'USER';
            const user = await this.prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName: dto.firstName.trim(),
                    lastName: dto.lastName.trim(),
                    role,
                    accounts: {
                        create: {
                            provider: AccountProvider.EMAIL,
                            providerAccountId: email,
                        },
                    },
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatarUrl: true,
                    status: true,
                    emailVerifiedAt: true,
                    createdAt: true,
                },
            });

            return user;
        } catch (error: any) {
            // Cùng lý do race condition như ở Google flow: 2 request register
            // đồng thời cho cùng email có thể vượt qua check existingUser ở trên.
            if (error?.code === 'P2002') {
                throw new ConflictException({
                    code: 'EMAIL_ALREADY_EXISTS',
                    message: 'Unable to create account with this email.',
                });
            }

            throw error;
        }
    }
}
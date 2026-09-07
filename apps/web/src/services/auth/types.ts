import { AuthUser } from "@/store/auth.store";

export type LoginPayload = {
    email: string;
    password: string;
};

export type RegisterPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export type LoginResponse = {
    accessToken: string;
    expiresAt: string;
    user: AuthUser;
};

export interface Profile extends AuthUser  {
    zaloNumber: string;
    phoneNumber: string;
    whatAppsNumber: string;
    createdAt: string;
    role: 'ADMIN' | 'USER'
    phoneVerifiedAt: string | null
    emailVerifiedAt: string | null
    status: 'ACTIVE' | 'INACTIVE'
}

// Response thật của POST /auth/register hiện tại (xem AuthService.register) -
// không có accessToken, chỉ trả profile vừa tạo. User vẫn phải login lại sau đó.
export type RegisterResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    status: string;
    emailVerifiedAt: string | null;
    createdAt: string;
};

// GET /auth/me hiện chỉ trả payload JWT (userId/email/sessionId), CHƯA phải
// full profile như LoginResponse.user. Nếu cần đủ firstName/avatarUrl sau khi
// bootstrap qua refresh token, backend cần bổ sung 1 endpoint kiểu
// GET /users/me trả đầy đủ profile.
export type MeResponse = {
    user: AuthUser
};


export interface UpdateProfilePayload {
    firstName?: string
    lastName?: string
    phoneNumber?: string
    zaloNumber?: string
    whatAppsNumber?: string
    facebookLink?: string
}
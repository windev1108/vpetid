import { AuthUser } from "@/store/auth.store";
import { apiRequest, refreshAccessToken, RefreshResult } from "../client";
import { LoginPayload, LoginResponse, MeResponse, Profile, RegisterPayload, RegisterResponse, UpdateProfilePayload } from "./types";

export function login(payload: LoginPayload): Promise<LoginResponse> {
    return apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: payload,
        skipAuth: true,
    });
}

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
    return apiRequest<RegisterResponse>("/auth/register", {
        method: "POST",
        body: payload,
        skipAuth: true,
    });
}

export function updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    return apiRequest<AuthUser>("/profile", {
        method: "PATCH",
        body: payload,
    });
}

export function getProfile(): Promise<Profile> {
    return apiRequest<Profile>("/profile");
}

export function logout(): Promise<{ success: boolean }> {
    return apiRequest<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export function me(): Promise<MeResponse> {
    return apiRequest<MeResponse>("/auth/me");
}

export function refreshSession(): Promise<RefreshResult> {
    return refreshAccessToken();
}

export function getGoogleLoginUrl(): string {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    return `${base}/auth/google`;
}
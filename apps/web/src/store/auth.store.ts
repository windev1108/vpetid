"use client";

import { useSyncExternalStore } from "react";

export type AuthUser = {
    id?: string;
    userId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
};

type AuthState = {
    accessToken: string | null;
    expiresAt: string | null;
    user: AuthUser | null;
};

let state: AuthState = {
    accessToken: null,
    expiresAt: null,
    user: null,
};

const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

/**
 * Access token chỉ sống trong memory (biến module-level), KHÔNG lưu localStorage
 * hay sessionStorage - tránh bị đánh cắp qua XSS. Refresh token thật sự nằm ở
 * cookie httpOnly do backend set, JS phía FE không bao giờ đọc được nó.
 * Hệ quả: reload trang sẽ mất accessToken trong memory -> cần bootstrap lại
 * bằng /auth/refresh lúc app khởi động (xem useAuthBootstrap).
 */
export const authStore = {
    getState: (): AuthState => state,

    setAuth: (accessToken: string, expiresAt: string, user?: AuthUser | null) => {
        state = {
            accessToken,
            expiresAt,
            user: user !== undefined ? user : state.user,
        };
        emit();
    },

    setUser: (user: AuthUser | null) => {
        state = { ...state, user };
        emit();
    },

    clear: () => {
        state = { accessToken: null, expiresAt: null, user: null };
        emit();
    },

    getAccessToken: () => state.accessToken,

    subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
};

const emptyServerState: AuthState = { accessToken: null, expiresAt: null, user: null };

export function useAuthState(): AuthState {
    return useSyncExternalStore(
        authStore.subscribe,
        authStore.getState,
        () => emptyServerState,
    );
}
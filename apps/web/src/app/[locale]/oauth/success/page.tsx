"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";

import { ROUTES } from "@/lib/routes";
import { authStore } from "@/store/auth.store";
import { clearAuthFlagCookie, setAuthFlagCookie } from "@/services/auth/const";
import * as authApi from "@/services/auth/api";

export default function OAuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");
        const expiresAt = searchParams.get("expiresAt");

        if (!accessToken || !expiresAt) {
            router.replace(`${ROUTES.LOGIN}?error=oauth_failed`);
            return;
        }

        authStore.setAuth(accessToken, expiresAt);

        // Xoá token khỏi URL ngay lập tức - tránh lộ qua lịch sử trình duyệt,
        // referrer header, hay ai đó nhìn qua vai lúc URL còn hiện trên thanh địa chỉ.
        window.history.replaceState({}, "", "/oauth/success");

        authApi
            .me()
            .then(({ user }) => {
                authStore.setUser(user);
                setAuthFlagCookie();
                router.replace(ROUTES.DASHBOARD);
            })
            .catch(() => {
                authStore.clear();
                clearAuthFlagCookie();
                router.replace(`${ROUTES.LOGIN}?error=oauth_failed`);
            });
    }, [router, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent/40 border-t-accent" />
                <p className="text-sm text-muted">Signing you in…</p>
            </div>
        </div>
    );
}
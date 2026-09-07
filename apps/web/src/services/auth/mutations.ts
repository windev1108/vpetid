import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authStore, AuthUser } from "@/store/auth.store";
import { ApiError, refreshAccessToken } from "../client";
import { authKeys, clearAuthFlagCookie, setAuthFlagCookie } from "./const";
import { useRouter } from "@/i18n/navigation";
import { LoginPayload, LoginResponse, MeResponse, RegisterPayload, RegisterResponse, UpdateProfilePayload } from "./types";
import { getProfile, login, logout, me, register, updateProfile } from "./api";
import { useEffect, useState } from "react";

export function useAuthBootstrap() {
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function bootstrap() {
            try {
                const { accessToken, expiresAt } = await refreshAccessToken();
                if (cancelled) return;

                authStore.setAuth(accessToken, expiresAt);

                const { user } = await me();
                if (cancelled) return;

                authStore.setUser({
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatarUrl: user.avatarUrl,
                });
                setAuthFlagCookie();
            } catch {
                if (!cancelled) {
                    authStore.clear();
                    clearAuthFlagCookie();
                }
            } finally {
                if (!cancelled) setIsBootstrapping(false);
            }
        }

        bootstrap();

        return () => {
            cancelled = true;
        };
    }, []);

    return { isBootstrapping };
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation<LoginResponse, ApiError, LoginPayload>({
        mutationFn: login,
        onSuccess: (data) => {
            authStore.setAuth(data.accessToken, data.expiresAt, data.user);
            queryClient.invalidateQueries({ queryKey: authKeys.session });
        },
    });
}

export function useUpdateProfile() {
    return useMutation<AuthUser, ApiError, UpdateProfilePayload>({
        mutationFn: updateProfile,
    });
}

export function useRegister() {
    return useMutation<RegisterResponse, ApiError, RegisterPayload>({
        mutationFn: register,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: logout,
        onSettled: () => {
            authStore.clear();
            clearAuthFlagCookie();
            queryClient.clear();
            router.push("/login");
        },
    });
}

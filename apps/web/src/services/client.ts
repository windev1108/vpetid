import { PROTECTED_ROUTE_PREFIXES, ROUTES } from "@/lib/routes";
import { authStore, AuthUser } from "@/store/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiError extends Error {
    status: number;
    code: string;

    constructor(status: number, code: string, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: unknown;
    // Bỏ qua gắn Authorization header - dùng cho login/register/refresh/google,
    // những request chưa cần (hoặc chưa thể) có access token hợp lệ.
    skipAuth?: boolean;
    // Cờ nội bộ để tránh loop vô hạn: request retry sau khi refresh sẽ không
    // được refresh thêm lần nữa dù có 401.
    skipRetry?: boolean;
};

async function rawRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, skipAuth = false } = options;

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

    const headers: Record<string, string> = {
        // Không set Content-Type khi là FormData - browser tự set đúng
        // multipart/form-data; boundary=... dựa trên object thật, set tay
        // (hoặc thiếu bước loại trừ này) sẽ làm mất boundary khiến BE không
        // parse được phần file trong request.
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
    };

    if (!skipAuth) {
        const token = authStore.getAccessToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers,
        credentials: "include",
        body: isFormData
            ? (body as FormData)
            : body !== undefined
                ? JSON.stringify(body)
                : undefined,
    });

    const contentType = response.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : null;

    if (!response.ok) {
        throw new ApiError(
            response.status,
            data?.code ?? "UNKNOWN_ERROR",
            data?.message ?? "Something went wrong. Please try again.",
        );
    }

    return data as T;
}

export type RefreshResult = { accessToken: string; expiresAt: string, user: AuthUser };

export function refreshAccessToken(): Promise<RefreshResult> {
    return rawRequest<RefreshResult>("/auth/refresh", {
        method: "POST",
        skipAuth: true,
    });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    try {
        return await rawRequest<T>(path, options);
    } catch (error) {
        const shouldTryRefresh =
            error instanceof ApiError &&
            error.status === 401 &&
            !options.skipAuth &&
            !options.skipRetry;

        if (!shouldTryRefresh) {
            throw error;
        }

        try {
            const refreshed = await refreshAccessToken();
            authStore.setAuth(refreshed.accessToken, refreshed.expiresAt);
            authStore.setUser({
                userId: refreshed.user.id!,
                email: refreshed.user?.email,
                firstName: refreshed?.user.firstName,
                lastName: refreshed?.user.lastName,
                avatarUrl: refreshed?.user.avatarUrl,
            });

            return await rawRequest<T>(path, { ...options, skipRetry: true });
        } catch {
            // Refresh cũng thất bại (refresh token hết hạn/bị revoke) -> logout thật sự.
            authStore.clear();
            const pathname = location.pathname
            const isProtected = PROTECTED_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
            if (isProtected) {
                navigation.navigate(ROUTES.LOGIN)
            }
            throw error;
        }
    }
}
const AUTH_FLAG_COOKIE = "vpetid-auth-state";
// Khớp thời hạn refresh session bên backend (30 ngày) để 2 cờ không lệch pha quá xa.
// Vẫn có thể lệch nếu refresh token bị revoke sớm hơn - đó là lý do cờ này
// chỉ dùng để routing, không dùng để quyết định user có được phép gọi API hay không.
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const authKeys = {
    session: ["auth", "session"] as const,
};

/**
 * Cookie này CHỈ để middleware (chạy trên domain FE) biết "có khả năng đã
 * đăng nhập" nhằm quyết định redirect /login <-> trang protected, tránh
 * flash nội dung sai hoặc redirect loop. Nó không httpOnly, không dùng để
 * xác thực API - việc đó luôn do access token (Bearer header) + refresh
 * token httpOnly phía backend đảm nhiệm.
 *
 * Vì FE và API thường khác domain nên không share được cookie backend set -
 * cờ này phải do chính FE set/xoá mỗi khi trạng thái auth thay đổi thật sự.
 */
export function setAuthFlagCookie() {
    if (typeof document === "undefined") return;

    const secure = process.env.NODE_ENV === "production" ? "; secure" : "";
    document.cookie = `${AUTH_FLAG_COOKIE}=1; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

export function clearAuthFlagCookie() {
    if (typeof document === "undefined") return;
    document.cookie = `${AUTH_FLAG_COOKIE}=; path=/; max-age=0; samesite=lax`;
}
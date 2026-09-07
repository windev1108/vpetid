export const REFRESH_TOKEN_COOKIE = 'refresh_token';
export const GOOGLE_STATE_COOKIE = 'google_oauth_state';

/**
 * Options cho refresh token cookie.
 * path: '/auth' để cookie chỉ được gửi kèm các request tới /auth/*,
 * hạn chế bề mặt lộ token nếu có XSS ở route khác.
 */
export function getRefreshCookieOptions() {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/auth',
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 ngày, khớp với thời hạn refresh session
    };
}
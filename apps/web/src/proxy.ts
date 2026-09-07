import { NextResponse, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES, WITHOUT_LAYOUT_ROUTES } from './lib/routes';

const intlMiddleware = createMiddleware(routing);

// TODO: đối chiếu lại với ROUTES trong lib/routes.ts - đây là danh sách suy ra
// từ những route đã thấy dùng trong project (dashboard, profile...). Sửa cho
// khớp chính xác cấu trúc route thật của VPetId, thêm/bớt nếu thiếu.

// Đồng bộ với AUTH_FLAG_COOKIE trong lib/auth/auth-flag-cookie.ts.
// Đổi tên ở 1 chỗ mà quên chỗ kia -> middleware sẽ luôn coi user là chưa đăng nhập.
const AUTH_FLAG_COOKIE = 'vpetid-auth-state';

// Nếu VPetId có route công khai kiểu "xem hồ sơ thú cưng qua mã QR" (id không
// đoán được, không cần đăng nhập - vd /pets/PET-XXXXXXXX hoặc /p/:publicCode),
// thêm 1 regex loại trừ tương tự ORDER_DETAIL_RE cũ ở đây, rồi && !PUBLIC_RE.test(...)
// ở điều kiện isProtected bên dưới. Hiện tại mình bỏ hẳn vì không chắc route
// này có tồn tại ở VPetId hay không.

const LOCALE_PREFIX_RE = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);

function stripLocale(pathname: string): string {
    const withoutLocale = pathname.replace(LOCALE_PREFIX_RE, '');
    return withoutLocale === '' ? '/' : withoutLocale;
}

function getLocalePrefix(pathname: string): string {
    const match = pathname.match(LOCALE_PREFIX_RE);
    return match ? match[0] : '';
}


export default function middleware(request: NextRequest) {
    const { pathname: rawPathname } = request.nextUrl;
    const pathname = stripLocale(rawPathname);
    const localePrefix = getLocalePrefix(rawPathname);

    const isAuth = request.cookies.get(AUTH_FLAG_COOKIE)?.value === '1';

    const isAuthPage = AUTH_ROUTES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (isAuthPage && isAuth) {
        // Đã đăng nhập mà cố vào /login, /register... -> đưa thẳng vào dashboard,
        // nhất quán với nơi LoginForm redirect tới sau khi login thành công.
        return NextResponse.redirect(new URL(`${localePrefix}/dashboard`, request.url));
    }

    const isProtected = PROTECTED_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (isProtected && !isAuth) {
        const loginUrl = new URL(`${localePrefix}/login`, request.url);
        // Giữ lại nơi user định vào để sau khi login xong redirect về đúng chỗ.
        // Nếu không cần tính năng này, bỏ dòng dưới và đọc redirect ở LoginForm.
        loginUrl.searchParams.set('redirect', rawPathname);
        return NextResponse.redirect(loginUrl);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
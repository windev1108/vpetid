export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    PETS: '/pets',
    PROFILE: '/profile',
    PUBLIC: '/public',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    ONBOARDING: '/onboarding',
    CREATE_PET: '/create-pet'
}


export const PROTECTED_ROUTE_PREFIXES = [
    "/dashboard",
    "/pets",
    "/profile",
    "/create-pet",
    "/settings",
    "/order-tag",
    "/scan",
];

export const AUTH_ROUTES = [
    '/login',
    '/register',
]

export const WITHOUT_LAYOUT_ROUTES = [
    '/login',
    '/register',
    '/public',
    '/onboarding'
]

export function isProtectedPath(pathname: string) {
    return PROTECTED_ROUTE_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}
export const SITE_CONFIG = {
    logoUrl: "/images/logo-horizontal.png",
    navLinks: [
        { label: "Home", href: "/", active: true },
        { label: "About", href: "/about", active: false },
        { label: "Contact", href: "/contact", active: false },
    ],
    footerLinks: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Contact Us", href: "#" },
        { label: "Global Registry", href: "#" },
    ],
    heroUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuASWNSBpFK_m3TTI0oHKbueg6hQoqQMF-OKSzukYdM5qJclSrjmWpl8jt6ZUqLCghTV05VTptmRwwyEBuBrDpZlKBA_b-5nVZQiv3RUoHDjEI_i4jZULfi4rf0t1VxjOEyLvOdgfIjKwUjYgraxHRKdN76d2f1WgjQdRJ6dNr6QnDpDRFYSvWy-j3FTzyd0kW_3X1-vJrb9fQv3keMJt5SqTdq7WrQmYvAz1qWufpVDmnt2fPNnZYPUCw",
    biometricImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBB8mSDC4veA2qb3dQJSTqEQALdNqNaXn_nB98_jEdRUZH8XMjaYCF6u1NTSYyQtt3oiE2JvDdtXqJVAC46WuMv14ZUkXmVQEKFLsT0IE8M89u7NklqZBwvnD9iipd_p9XVkRY2ex4xAYybZp2FeQtXYYvQJwg-PSDsZmoGsEFLIaAG2x87mVjsJKNy7lYoi81gTSbVxC6ad8PQ2VdWTeLRTRfPJ3VtUlzFW2um42lYoIXUloPxejQwCA"
}


export type Feature = {
    id: string;
    icon: string;
    titleKey: string;
    descriptionKey: string;
    variant?: "default" | "danger";
};

export const features : Feature[] = [
    {
        id: "identity",
        icon: "badge",
        titleKey: "identity.title",
        descriptionKey: "identity.description",
    },
    {
        id: "health",
        icon: "health_and_safety",
        titleKey: "health.title",
        descriptionKey: "health.description",
    },
    {
        id: "safety",
        icon: "pets",
        titleKey: "safety.title",
        descriptionKey: "safety.description",
        variant: "danger",
    },
    {
        id: "legal",
        icon: "verified_user",
        titleKey: "legal.title",
        descriptionKey: "legal.description",
    },
];


export type MiniFeature = {
    id: string
    icon: string;
    titleKey: string;
    descriptionKey: string;
};

export const miniFeatures : MiniFeature[] = [
    {
        id: "vaccination",
        icon: "vaccines",
        titleKey: "vaccination.title",
        descriptionKey: "vaccination.description",
    },
    {
        id: "reminders",
        icon: "notifications_active",
        titleKey: "reminders.title",
        descriptionKey: "reminders.description",
    },
];


export type PricingTier = {
    id: string;
    price: string;
    period: string;
    description: string;
    recommended?: boolean;
};

export const pricingTiers = [
    {
        id: "free",
        price: "$0",
        recommended: false,
    },
    {
        id: "premium",
        price: "$9.99",
        recommended: true,
    },
];
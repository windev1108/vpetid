// components/layout/Navbar.tsx
"use client";

import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { useAuthState } from "@/store/auth.store";
import { NavbarUserMenu } from "./NavbarUserMenu";

export function Navbar() {
    const t = useTranslations();
    const { user } = useAuthState();
    const isAuthenticated = Boolean(user);
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-separator/30 bg-surface/80 backdrop-blur-md transition-all duration-300">
            <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-margin-mobile md:px-margin-desktop">
                <Link href={ROUTES.HOME} className="flex items-center gap-2">
                    <Image src={SITE_CONFIG.logoUrl} alt="VPetId Logo" width={112} height={32} className="h-8 w-auto" unoptimized />
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    {SITE_CONFIG.navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className={
                                link.active
                                    ? "border-b-2 border-accent pb-1 font-bold text-accent"
                                    : "text-muted transition-colors hover:text-accent"
                            }
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />

                    {isAuthenticated ? (
                        <NavbarUserMenu user={user!} />
                    ) : (
                        <>
                            <Link
                                href={ROUTES.LOGIN}
                                className="hidden font-medium text-muted transition-colors hover:text-accent md:block"
                            >
                                {t("signin")}
                            </Link>
                            <Link
                                href={ROUTES.REGISTER}
                                className="rounded-lg bg-accent px-6 py-2.5 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
                            >
                                {t("get_started")}
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
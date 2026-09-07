// components/SidebarNav.tsx
"use client";

import { motion } from "motion/react";
import { Button, Spinner, Tooltip } from "@heroui/react";
import { Link, usePathname } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { useLogout } from "@/services/auth/mutations";
import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";
import { useTranslations } from "next-intl";


export const BOTTOM_ITEMS = [];

function SidebarLabel({ collapsed, children }: { collapsed: boolean; children: React.ReactNode }) {
    return (
        <motion.span
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden whitespace-nowrap font-label-md text-label-md"
        >
            {children}
        </motion.span>
    );
}

function withCollapsedTooltip(collapsed: boolean, label: string, node: React.ReactNode) {
    if (!collapsed) return node;
    return (
        <Tooltip delay={200}>
            <Tooltip.Trigger>{node}</Tooltip.Trigger>
            <Tooltip.Content placement="right" offset={10}>
                {label}
            </Tooltip.Content>
        </Tooltip>
    );
}

type SidebarNavProps = {
    collapsed: boolean;
    onNavigate?: () => void;
};

export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
    const pathname = usePathname();
    const t = useTranslations();
    const NAV_ITEMS = [
        { label: t("overview"), icon: "dashboard", href: ROUTES.DASHBOARD },
        { label: t("my_pets"), icon: "pets", href: "/pets" },
        { label: t("profile"), icon: "person", href: ROUTES.PROFILE },
        // { label: t("health"), icon: "favorite", href: "/health" },
        // { label: t("lost_found"), icon: "search", href: "/lost-found" },
        // { label: t("pet_identity"), icon: "badge", href: "/pet-identity" },
        // { label: t("pet_passport"), icon: "menu_book", href: "/pet-passport" },
        // { label: t("store"), icon: "storefront", href: "/store" },
        // { label: t("notifications"), icon: "notifications", href: "/notifications" },
        // { label: t("family"), icon: "family_restroom", href: "/family" },
        // { label: t("settings"), icon: "settings", href: "/settings" },
    ];

    return (
        <nav className="flex-1 overflow-x-hidden overflow-y-auto px-3">
            <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <li key={item.href}>
                            {withCollapsedTooltip(
                                collapsed,
                                item.label,
                                <Link
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${isActive
                                        ? "bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]"
                                        : "text-muted hover:bg-background-secondary hover:text-foreground"
                                        }`}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="sidebar-active-indicator"
                                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                            className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-accent"
                                        />
                                    )}
                                    <span className="material-symbols-outlined shrink-0 text-[20px]">
                                        {item.icon}
                                    </span>
                                    <SidebarLabel collapsed={collapsed}>
                                        {item.label}
                                    </SidebarLabel>
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

type SidebarBottomProps = {
    collapsed: boolean;
    onNavigate?: () => void;
};

export function SidebarBottom({ collapsed, onNavigate }: SidebarBottomProps) {
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const t = useTranslations();
    return (
        <div className="border-t border-separator px-3 py-4">
            <ul className="flex flex-col gap-1">
                {BOTTOM_ITEMS.map((item) => (
                    <li key={item.href}>
                        {withCollapsedTooltip(
                            collapsed,
                            item.label,
                            <Link
                                href={item.href}
                                onClick={onNavigate}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-background-secondary hover:text-foreground"
                            >
                                <span className="material-symbols-outlined shrink-0 text-[20px]">
                                    {item.icon}
                                </span>
                                <SidebarLabel collapsed={collapsed}>
                                    {item.label}
                                </SidebarLabel>
                            </Link>
                        )}
                    </li>
                ))}
                <li>
                    {withCollapsedTooltip(
                        collapsed,
                        t("logout"),
                        <Button
                            onClick={() => {
                                onNavigate?.();
                                logout();
                            }}
                            variant='ghost'
                            isPending={isLoggingOut}
                            className="justify-start flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-danger transition-colors hover:bg-[color:var(--color-danger-soft-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoggingOut ?
                                <Spinner />
                                :
                                <span className="material-symbols-outlined shrink-0 text-[20px]">
                                    logout
                                </span>
                            }
                            <SidebarLabel collapsed={collapsed}>
                                {t('logout')}
                            </SidebarLabel>
                        </Button>
                    )}
                </li>
            </ul>
        </div>
    );
}

type SidebarBrandProps = {
    collapsed: boolean;
    onNavigate?: () => void;
};

export function SidebarBrand({ collapsed, onNavigate }: SidebarBrandProps) {
    return (
        <Link
            href={ROUTES.HOME}
            onClick={onNavigate}
            className="flex flex-col items-center gap-2 px-4 pb-4 pt-6"
        >
            <Image src={SITE_CONFIG.logoUrl} alt="VPetId Logo" width={112} height={32} className="h-8 w-auto" unoptimized />
            <motion.div
                animate={{ opacity: collapsed ? 0 : 1, height: collapsed ? 0 : "auto" }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden text-center"
            >
            </motion.div>
        </Link>
    );
}

type SidebarAddPetProps = {
    collapsed: boolean;
    onNavigate?: () => void;
};

export function SidebarAddPetButton({ collapsed, onNavigate }: SidebarAddPetProps) {
    const t = useTranslations();
    return (
        <div className="px-3 pb-4">
            {withCollapsedTooltip(
                collapsed,
                t("add_pet"),
                <Link
                    href={ROUTES.CREATE_PET}
                    onClick={onNavigate}
                    className="flex items-center justify-center gap-2 rounded-lg bg-accent px-3 py-2.5 font-label-md text-label-md font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-[color:var(--color-accent-hover)]"
                >
                    <span className="material-symbols-outlined shrink-0 text-[20px]">add</span>
                    <SidebarLabel collapsed={collapsed}>
                        {t("add_pet")}
                    </SidebarLabel>
                </Link>
            )}
        </div>
    );
}
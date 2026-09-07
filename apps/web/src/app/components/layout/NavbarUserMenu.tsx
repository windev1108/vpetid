// components/layout/NavbarUserMenu.tsx
"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { AuthUser } from "@/store/auth.store";
import { ROUTES } from "@/lib/routes";
import { useLogout, useMe } from "@/services/auth/mutations";
import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";

type NavbarUserMenuProps = {
    user: AuthUser;
};

export function NavbarUserMenu({ user }: NavbarUserMenuProps) {
    const [open, setOpen] = useState(false);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;
    const initial = (user.firstName?.[0] ?? user.email[0] ?? "?").toUpperCase();

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-background-secondary"
            >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-default">
                    <Avatar>
                        <AvatarImage src={user?.avatarUrl as string} />
                        <AvatarFallback >
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <span className="hidden max-w-[120px] truncate font-label-md text-label-md text-foreground sm:block">
                    {displayName}
                </span>
                <span className="material-symbols-outlined text-[18px] text-muted">
                    expand_more
                </span>
            </button>

            {open && (
                <>
                    {/* Click-outside overlay */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                        aria-hidden
                    />
                    <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-separator bg-surface shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                        <div className="border-b border-separator px-4 py-3">
                            <div className="truncate font-label-md text-label-md font-semibold text-foreground">
                                {displayName}
                            </div>
                            <div className="truncate font-label-sm text-label-sm text-muted">
                                {user.email}
                            </div>
                        </div>

                        <Link
                            href={ROUTES.DASHBOARD}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 font-label-md text-label-md text-foreground transition-colors hover:bg-background-secondary"
                        >
                            <span className="material-symbols-outlined text-[18px]">dashboard</span>
                            Dashboard
                        </Link>
                        <Link
                            href="/settings"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 font-label-md text-label-md text-foreground transition-colors hover:bg-background-secondary"
                        >
                            <span className="material-symbols-outlined text-[18px]">settings</span>
                            Settings
                        </Link>

                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                logout();
                            }}
                            disabled={isLoggingOut}
                            className="flex w-full items-center gap-3 border-t border-separator px-4 py-2.5 font-label-md text-label-md text-danger transition-colors hover:bg-[color:var(--color-danger-soft-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoggingOut ? (
                                <span className="h-[18px] w-[18px] shrink-0 animate-spin rounded-full border-2 border-danger/30 border-t-danger" />
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                            )}
                            {isLoggingOut ? "Logging out…" : "Logout"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
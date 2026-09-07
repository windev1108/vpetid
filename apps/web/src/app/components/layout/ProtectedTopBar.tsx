// components/ProtectedTopBar.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useAuthState } from "@/store/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react/avatar";
import { useLogout } from "@/services/auth/mutations";
import { Button } from "@heroui/react";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { useTranslations } from "next-intl";

type ProtectedTopBarProps = {
    onMenuClick: () => void;
};

export function ProtectedTopBar({ onMenuClick }: ProtectedTopBarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { user } = useAuthState();
    const displayName =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email;
    const initial = (user?.firstName?.[0] ?? user?.email[0] ?? "?").toUpperCase();
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const t = useTranslations()

    // Đóng dropdown khi click ra ngoài vùng menuRef (nút trigger + panel dropdown).
    // mousedown thay vì click để bắt được trước khi target bên trong panel bị unmount
    // (vd click vào Link điều hướng), tránh miss sự kiện đóng.
    useEffect(() => {
        if (!menuOpen) return;

        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setMenuOpen(false);
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between gap-3 border-b border-separator bg-surface px-4 md:justify-end md:px-6">
            <button
                type="button"
                onClick={onMenuClick}
                aria-label="Open menu"
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary hover:text-foreground md:hidden"
            >
                <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <div className="flex items-center gap-3">
                <LanguageSwitcher />
                <button
                    type="button"
                    aria-label="Notifications"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary hover:text-foreground"
                >
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                {user &&
                    <div ref={menuRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-background-secondary"
                        >
                            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-default">
                                <Avatar>
                                    <AvatarImage src={user?.avatarUrl as string} />
                                    <AvatarFallback>{initial}</AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="hidden font-label-md text-label-md text-foreground sm:block">
                                {displayName}
                            </span>
                            <span className="material-symbols-outlined text-[18px] text-muted">
                                expand_more
                            </span>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-separator bg-surface shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                                <div className="border-b border-separator px-4 py-3">
                                    <div className="truncate font-label-md text-label-md font-semibold text-foreground">
                                        {displayName}
                                    </div>
                                    <div className="truncate font-label-sm text-label-sm text-muted">
                                        {user?.email}
                                    </div>
                                </div>
                                <Link
                                    href="/profile"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 font-label-md text-label-md text-foreground transition-colors hover:bg-background-secondary"
                                >
                                    <span className="material-symbols-outlined text-[18px]">person</span>
                                    {t("profile")}
                                </Link>
                                {/* <Link
                                    href="/settings"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 font-label-md text-label-md text-foreground transition-colors hover:bg-background-secondary"
                                >
                                    <span className="material-symbols-outlined text-[18px]">settings</span>
                                    Settings
                                </Link> */}
                                <Button
                                    isPending={isLoggingOut}
                                    variant="ghost"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logout();
                                    }}
                                    className="w-full justify-start text-left"
                                >
                                    <span className="material-symbols-outlined text-[18px]">logout</span>
                                    {t("logout")}
                                </Button>
                            </div>
                        )}
                    </div>
                }
            </div>
        </header>
    );
}
"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeMeta, type AppLocale } from "@/i18n/routing";

export function LanguageSwitcher() {
    const locale = useLocale() as AppLocale;
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);

    const current = localeMeta[locale];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setIsOpen(false);
        }
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    function handleSelect(newLocale: AppLocale) {
        setIsOpen(false);
        if (newLocale === locale) return;

        startTransition(() => {
            router.replace(pathname, { locale: newLocale });
        });
    }

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                disabled={isPending}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="flex items-center gap-2 rounded-lg border border-separator bg-surface px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-background-secondary disabled:opacity-60"
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span>{current.shortLabel}</span>
                <span
                    className={`material-symbols-outlined text-base text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                >
                    expand_more
                </span>
            </button>

            {isOpen && (
                <ul
                    role="listbox"
                    aria-label="Select language"
                    className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-separator bg-surface py-1 shadow-level-2"
                >
                    {routing.locales.map((loc) => {
                        const meta = localeMeta[loc];
                        const isActive = loc === locale;

                        return (
                            <li key={loc} role="option" aria-selected={isActive}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(loc)}
                                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${isActive
                                        ? "bg-accent/10 font-medium text-accent"
                                        : "text-foreground hover:bg-background-secondary"
                                        }`}
                                >
                                    <span className="text-base leading-none">{meta.flag}</span>
                                    <span className="flex-1">{meta.label}</span>
                                    {isActive && (
                                        <span className="material-symbols-outlined text-base text-accent">check</span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
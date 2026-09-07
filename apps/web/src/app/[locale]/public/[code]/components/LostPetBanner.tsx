// app/p/[code]/components/PublicLostBanner.tsx
"use client";

import { useTranslations } from "next-intl";

type PublicLostBannerProps = {
    petName: string;
};

export function PublicLostBanner({ petName }: PublicLostBannerProps) {
    const t = useTranslations("PublicPet.lostBanner");

    return (
        <div className="flex w-full flex-col items-center justify-between gap-4 rounded-2xl border border-danger/20 bg-[color:var(--color-danger-soft-hover)] p-6 shadow-sm md:flex-row animate-[urgent-pulse_2s_infinite]">
            <div className="flex items-center gap-3">
                <span
                    className="material-symbols-outlined text-3xl text-[color:var(--color-danger-soft-foreground)]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    warning
                </span>
                <div className="flex flex-col">
                    <h2 className="m-0 font-headline-lg-mobile text-headline-lg-mobile font-bold uppercase tracking-widest text-[color:var(--color-danger-soft-foreground)] md:font-headline-lg md:text-headline-lg">
                        {t("title")}
                    </h2>
                    <span className="font-label-sm text-label-sm text-[color:var(--color-danger-soft-foreground)] opacity-90">
                        {t("urgent", { name: petName })}
                    </span>
                </div>
            </div>
        </div>
    );
}
"use client";

import { MiniFeature } from "@/config/site";
import { useTranslations } from "next-intl";

export function MiniFeatureCard({
    icon,
    titleKey,
    descriptionKey,
}: MiniFeature) {
    const t = useTranslations("LandingPage.features.miniItems");

    return (
        <div className="flex items-center gap-6 rounded-2xl border border-separator bg-surface p-6 shadow-level-1 transition-all duration-300 hover:shadow-level-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background-secondary">
                <span className="material-symbols-outlined text-xl text-accent">
                    {icon}
                </span>
            </div>

            <div>
                <h3 className="mb-1 text-sm font-semibold text-foreground">
                    {t(titleKey)}
                </h3>

                <p className="text-sm text-muted">
                    {t(descriptionKey)}
                </p>
            </div>
        </div>
    );
}

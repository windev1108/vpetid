"use client";

import { Feature } from "@/config/site";
import { useTranslations } from "next-intl";

export function FeatureCard({
    icon,
    titleKey,
    descriptionKey,
    variant = "default",
}: Feature) {
    const t = useTranslations("LandingPage.features.items");

    const isDanger = variant === "danger";

    return (
        <div className="group rounded-2xl border border-separator bg-surface p-8 shadow-level-1 transition-all duration-300 hover:border-accent/30 hover:shadow-level-2">
            <div
                className={
                    isDanger
                        ? "mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-danger-soft-hover/30 transition-colors group-hover:bg-danger-soft-hover/50"
                        : "mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-background-secondary transition-colors group-hover:bg-accent/10"
                }
            >
                <span
                    className={`material-symbols-outlined text-2xl ${
                        isDanger ? "text-danger" : "text-accent"
                    }`}
                >
                    {icon}
                </span>
            </div>

            <h3 className="mb-3 text-xl font-semibold text-foreground">
                {t(`${titleKey}`)}
            </h3>

            <p className="text-base text-muted">
                {t(`${descriptionKey}`)}
            </p>
        </div>
    );
}

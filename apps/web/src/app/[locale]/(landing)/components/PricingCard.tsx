"use client";

import { useTranslations } from "next-intl";
import { PricingTier } from "@/config/site";

export function PricingCard({
    id,
    price,
    recommended,
}: PricingTier) {
    const t = useTranslations(`LandingPage.pricing.tiers.${id}`);

    const name = t("name");
    const period = t("period");
    const description = t("description");
    const cta = t("cta");
    const perks = t.raw("perks") as string[];

    if (recommended) {
        return (
            <div className="relative flex h-full flex-col overflow-hidden rounded-[24px] border border-foreground bg-foreground p-8 shadow-level-3 md:p-10">
                <div className="absolute right-0 top-0 rounded-bl-xl bg-accent px-4 py-1 text-xs font-bold text-accent-foreground">
                    {t("recommended")}
                </div>

                <h3 className="mb-2 text-xl font-semibold text-background">
                    {name}
                </h3>

                <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-background">
                        {price}
                    </span>

                    <span className="text-base text-background/70">
                        {period}
                    </span>
                </div>

                <p className="mb-8 text-base text-background/70">
                    {description}
                </p>

                <div className="mb-8 flex flex-grow flex-col gap-4">
                    {perks.map((perk) => (
                        <div
                            key={perk}
                            className="flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-sm text-accent">
                                check_circle
                            </span>

                            <span className="text-base text-background">
                                {perk}
                            </span>
                        </div>
                    ))}
                </div>

                <button className="w-full rounded-lg bg-accent py-4 font-semibold text-accent-foreground shadow-lg transition-colors hover:bg-accent-hover">
                    {cta}
                </button>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col rounded-[24px] border border-separator bg-surface p-8 shadow-level-1 md:p-10">
            <h3 className="mb-2 text-xl font-semibold text-foreground">
                {name}
            </h3>

            <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
                    {price}
                </span>

                <span className="text-base text-muted">
                    {period}
                </span>
            </div>

            <p className="mb-8 text-base text-muted">
                {description}
            </p>

            <div className="mb-8 flex flex-grow flex-col gap-4">
                {perks.map((perk) => (
                    <div
                        key={perk}
                        className="flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined text-sm text-accent">
                            check_circle
                        </span>

                        <span className="text-base text-foreground">
                            {perk}
                        </span>
                    </div>
                ))}
            </div>

            <button className="w-full rounded-lg border border-separator bg-background-secondary py-4 font-semibold text-foreground transition-colors hover:bg-default">
                {cta}
            </button>
        </div>
    );
}

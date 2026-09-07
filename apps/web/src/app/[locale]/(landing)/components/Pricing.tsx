"use client";

import { useTranslations } from "next-intl";

import { pricingTiers } from "@/config/site";
import { PricingCard } from "./PricingCard";

export function Pricing() {
    const t = useTranslations("LandingPage.pricing");

    return (
        <section className="w-full bg-background px-margin-mobile py-24 md:px-margin-desktop">
            <div className="mx-auto max-w-[1280px]">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl md:leading-[56px]">
                        {t("title")}
                    </h2>

                    <p className="text-lg text-muted">
                        {t("description")}
                    </p>
                </div>

                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                    {pricingTiers.map((tier) => (
                        <PricingCard
                            key={tier.id}
                            {...tier}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

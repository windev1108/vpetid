"use client";

import { useTranslations } from "next-intl";

import { BiometricFeature } from "./BiometricFeature";
import { FeatureCard } from "./FeatureCard";
import { MiniFeatureCard } from "./MiniFeatureCard";
import { features, miniFeatures } from "@/config/site";

export function Features() {
    const t = useTranslations("LandingPage.features");

    return (
        <section className="w-full border-y border-separator bg-background-secondary px-margin-mobile py-24 md:px-margin-desktop">
            <div className="mx-auto max-w-[1280px]">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl md:leading-[56px]">
                        {t("title")}
                    </h2>

                    <p className="text-lg text-muted">
                        {t("description")}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.id}
                            {...feature}
                        />
                    ))}

                    <BiometricFeature />

                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {miniFeatures.map((feature) => (
                            <MiniFeatureCard
                                key={feature.id}
                                {...feature}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

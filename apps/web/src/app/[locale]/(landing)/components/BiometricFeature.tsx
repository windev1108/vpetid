"use client";

import { useTranslations } from "next-intl";
import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";

export function BiometricFeature() {
    const t = useTranslations("LandingPage.features.biometric");

    return (
        <div className="group rounded-2xl border border-separator bg-surface p-8 shadow-level-1 transition-all duration-300 hover:border-accent/30 hover:shadow-level-2 lg:col-span-2">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
                <div className="flex-1">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-background-secondary transition-colors group-hover:bg-accent/10">
                        <span className="material-symbols-outlined text-2xl text-accent">
                            fingerprint
                        </span>
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-foreground">
                        {t("title")}
                    </h3>

                    <p className="text-base text-muted">
                        {t("description")}
                    </p>
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-background-tertiary md:w-1/2">
                    <Image
                        src={SITE_CONFIG.biometricImageUrl}
                        alt={t("imageAlt")}
                        fill
                        unoptimized
                        className="absolute inset-0 object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

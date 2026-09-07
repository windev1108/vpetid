"use client";

import { SITE_CONFIG } from "@/config/site";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function Hero() {
    const t = useTranslations("LandingPage.hero");

    return (
        <section className="mx-auto w-full max-w-[1280px] px-margin-mobile pb-24 pt-32 md:px-margin-desktop">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
                <div className="flex flex-col gap-8">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-accent-soft-hover/20 px-3 py-1 text-accent-soft-foreground">
                        <span className="material-symbols-outlined filled text-sm">
                            verified
                        </span>
                        <span className="text-xs font-medium tracking-wide">
                            {t("badge")}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h1 className="text-[40px] font-bold leading-[1.1] tracking-tight text-foreground md:text-[64px] md:leading-[72px]">
                            {t("title")}{" "}
                            <span className="text-accent">
                                {t("titleHighlight")}
                            </span>
                        </h1>

                        <p className="max-w-xl text-lg leading-7 text-muted">
                            {t("description")}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                        <Link href={ROUTES.LOGIN}>
                            <button className="flex items-center justify-center gap-2 rounded-lg bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-level-1 transition-all duration-200 hover:bg-accent-hover hover:shadow-level-2">
                                {t("primaryCta")}
                                <span className="material-symbols-outlined text-lg">
                                    arrow_forward
                                </span>
                            </button>
                        </Link>

                        {/* <button className="flex items-center justify-center gap-2 rounded-lg border border-separator bg-surface px-8 py-4 font-semibold text-foreground transition-all duration-200 hover:border-accent hover:text-accent">
                            {t("secondaryCta")}
                        </button> */}
                    </div>

                    <div className="mt-4 flex items-center gap-4 border-t border-separator pt-8">
                        <div className="flex -space-x-3">
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-default"
                                >
                                    <span className="material-symbols-outlined text-sm text-default-foreground">
                                        pets
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="text-xs text-muted">
                            <span className="font-bold text-foreground">
                                {t("socialProofCount")}
                            </span>{" "}
                            {t("socialProofText")}
                        </div>
                    </div>
                </div>

                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] shadow-level-3 lg:aspect-square">
                    <Image
                        src={SITE_CONFIG.heroUrl}
                        alt={t("imageAlt")}
                        fill
                        unoptimized
                        className="absolute inset-0 object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />

                    <div className="absolute bottom-8 left-8 right-8 flex items-center gap-4 rounded-2xl bg-surface/90 p-6 shadow-level-2 backdrop-blur-md">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft-hover">
                            <span className="material-symbols-outlined filled text-accent-soft-foreground">
                                my_location
                            </span>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                {t("locationVerified")}
                            </h3>

                            <p className="text-sm text-muted">
                                {t("locationExample")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

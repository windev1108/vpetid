// app/pets/[petCode]/components/LocationCard.tsx
"use client";

import { useTranslations } from "next-intl";
import { Card, Chip } from "@heroui/react";
import { placeholderLocation } from "@/services/pets/const";

type Location = typeof placeholderLocation;

export function LocationCard({ location }: { location?: Location }) {
    const t = useTranslations("PetDetail.location");

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <Chip className="absolute right-4 top-4 z-20 gap-1 bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                <Chip.Label className="font-semibold">{t("comingSoon")}</Chip.Label>
            </Chip>

            <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{t("title")}</h3>
                    <p className="text-xs text-muted">{location?.updatedAgo ?? '4h'}</p>
                </div>

                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/35 backdrop-blur-[2px]">
                    <div className="w-[calc(100%-32px)] max-w-sm rounded-2xl border border-white/60 bg-background-inverse/90 p-5 text-center shadow-xl backdrop-blur-md">
                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-success/15">
                            <span className="material-symbols-outlined text-success">location_on</span>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                            <h3 className="font-semibold text-white">{t("gpsTracking")}</h3>
                            <Chip size="sm" color="success">
                                {t("comingSoon")}
                            </Chip>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-white/70">{t("gpsDescription")}</p>
                    </div>
                </div>

                <div className="mt-auto">
                    <Card
                        variant="default"
                        className="inline-block max-w-sm border border-separator bg-surface/90 p-4 shadow-level-1 backdrop-blur"
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                                <span className="material-symbols-outlined">home_pin</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">
                                    {location?.address ?? t("defaultAddress")}
                                </p>
                                <p className="line-clamp-2 text-sm text-muted">{location?.detail ?? ''}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Card>
    );
}
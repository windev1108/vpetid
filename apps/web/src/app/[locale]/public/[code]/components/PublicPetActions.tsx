// app/p/[code]/components/PublicPetActions.tsx
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { LockClosedIcon, Share1Icon, PaperPlaneIcon } from "@radix-ui/react-icons";

type PublicPetActionsProps = {
    petName: string;
    isPendingShare: boolean;
    onShareLocation?: () => void;
    onShareOtherApps?: () => void;
};

export function PublicPetActions({ isPendingShare, petName, onShareLocation, onShareOtherApps }: PublicPetActionsProps) {
    const t = useTranslations("PublicPet.actions");

    return (
        <div className="flex flex-col gap-5 rounded-2xl border border-separator bg-background-secondary p-6 md:p-8">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100">
                    <span className="material-symbols-outlined text-[20px] text-indigo-500">shield</span>
                </div>
                <div>
                    <h3 className="font-headline-md text-headline-md text-foreground">
                        {t("title", { name: petName })}
                    </h3>
                    <p className="font-body-md text-body-md text-muted">{t("subtitle")}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                    isPending={isPendingShare}
                    variant="ghost"
                    onPress={onShareLocation}
                    className="flex h-auto flex-col items-start gap-0.5 bg-[color:var(--color-background-tertiary)] px-4 py-3 text-left hover:bg-default"
                >
                    <span className="flex items-center gap-2 font-label-md text-label-md font-semibold text-foreground">
                        <Share1Icon className="h-4 w-4" />
                        {t("shareLocation.label")}
                    </span>
                    <span className="font-label-sm text-label-sm text-muted">
                        {t("shareLocation.description")}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    onPress={onShareOtherApps}
                    className="flex h-auto flex-col items-start gap-0.5 bg-[color:var(--color-background-tertiary)] px-4 py-3 text-left hover:bg-default"
                >
                    <span className="flex items-center gap-2 font-label-md text-label-md font-semibold text-foreground">
                        <PaperPlaneIcon className="h-4 w-4" />
                        {t("shareOtherApps.label")}
                    </span>
                    <span className="font-label-sm text-label-sm text-muted">
                        {t("shareOtherApps.description")}
                    </span>
                </Button>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[color:var(--color-background-tertiary)] px-4 py-2.5">
                <LockClosedIcon className="h-3.5 w-3.5 text-muted" />
                <span className="font-label-sm text-label-sm text-muted">{t("privacyNote")}</span>
            </div>
        </div>
    );
}
"use client";

import { useTranslations } from "next-intl";
import { Button, Spinner } from "@heroui/react";
import { MobileHeader } from "./MobileHeader";
import { PetProfileSection } from "./PetProfileSection";
import { usePet } from "@/services/pets/queries";

export function PetDetailView({ petCode }: { petCode: string }) {
    const { data: pet, isLoading, isError, refetch } = usePet(petCode);
    const t = useTranslations("PetDetail");

    return (
        <main className="min-h-screen flex-1 overflow-y-auto bg-background-secondary xl:p-8 lg:p-6 p-4">
            <MobileHeader title={pet ? t("profileTitle", { name: pet.name }) : t("defaultTitle")} />

            <div className="mx-auto max-w-container-max">
                {isLoading && (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-muted">
                        <Spinner />
                        <p className="text-sm">{t("loading")}</p>
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
                        <span className="material-symbols-outlined text-5xl text-danger">error</span>
                        <div>
                            <p className="font-semibold text-foreground">{t("loadError.title")}</p>
                            <p className="text-sm text-muted">{t("loadError.subtitle")}</p>
                        </div>
                        <Button variant="secondary" onPress={() => refetch()}>
                            {t("loadError.retry")}
                        </Button>
                    </div>
                )}

                {!isLoading && !isError && !pet && (
                    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center text-muted">
                        <span className="material-symbols-outlined text-5xl">pets</span>
                        <p className="text-sm">{t("notFound", { petCode })}</p>
                    </div>
                )}

                {pet && <PetProfileSection pet={pet} />}
            </div>
        </main>
    );
}
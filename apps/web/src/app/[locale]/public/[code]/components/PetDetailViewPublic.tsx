// app/p/[code]/components/PetDetailViewPublic.tsx
"use client";

import { Chip } from "@heroui/react";
import { CheckCircledIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { getPetSubtitle } from "@/services/pets/display";
import { PublicPetHero } from "./PublicPetHero";
import { PublicPetInfoGrid } from "./PublicPetInfoGrid";
import { PublicContactOwnerCard } from "./PublicContactOwnerCard";
import { PublicPetActions } from "./PublicPetActions";
import { usePublicPet } from "@/services/pets/queries";
import { PublicLostBanner } from "./LostPetBanner";
import { useShareLocation } from "@/services/pets/mutations";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { PetStatus } from "@/services/pets/types";

function PublicPetSkeleton() {
    // No copy in this component — unchanged.
    return (
        <main className="flex w-full max-w-2xl flex-grow flex-col gap-6 pb-8">
            <div className="relative">
                <div className="aspect-[16/9] w-full animate-pulse rounded-b-[32px] bg-default md:aspect-[21/9]" />
                <div className="absolute left-1/2 top-full h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full border-4 border-surface bg-background-tertiary" />
            </div>

            <div className="flex flex-col gap-6 px-margin-mobile md:px-margin-desktop">
                <div className="mt-14 flex flex-col items-center gap-3">
                    <div className="h-8 w-48 animate-pulse rounded-lg bg-default" />
                    <div className="h-4 w-28 animate-pulse rounded-full bg-default" />
                    <div className="h-8 w-64 animate-pulse rounded-full bg-default" />
                </div>

                <div className="grid grid-cols-1 gap-6 divide-y divide-separator rounded-2xl border border-separator bg-background-secondary p-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:p-6">
                    {[0, 1, 2].map((col) => (
                        <div key={col} className={`flex flex-col gap-5 ${col > 0 ? "pt-5 md:pt-0 md:pl-6" : ""}`}>
                            {[0, 1].map((row) => (
                                <div key={row} className="flex items-start gap-3">
                                    <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-default" />
                                    <div className="flex flex-col gap-2">
                                        <div className="h-2.5 w-16 animate-pulse rounded bg-default" />
                                        <div className="h-3.5 w-20 animate-pulse rounded bg-default" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-separator bg-surface p-6 md:p-8">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-default" />
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-32 animate-pulse rounded bg-default" />
                            <div className="h-3 w-48 animate-pulse rounded bg-default" />
                        </div>
                    </div>
                    <div className="h-20 w-full animate-pulse rounded-xl bg-background-secondary" />
                </div>

                <div className="flex flex-col gap-5 rounded-2xl border border-separator bg-background-secondary p-6 md:p-8">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-default" />
                        <div className="flex flex-col gap-2">
                            <div className="h-4 w-40 animate-pulse rounded bg-default" />
                            <div className="h-3 w-56 animate-pulse rounded bg-default" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="h-16 w-full animate-pulse rounded-xl bg-[color:var(--color-background-tertiary)]" />
                        <div className="h-16 w-full animate-pulse rounded-xl bg-[color:var(--color-background-tertiary)]" />
                    </div>
                    <div className="h-9 w-full animate-pulse rounded-lg bg-[color:var(--color-background-tertiary)]" />
                </div>

                <div className="h-16 w-full animate-pulse rounded-2xl bg-default" />
            </div>
        </main>
    );
}

function PublicPetNotFound() {
    const t = useTranslations("PublicPet.notFound");

    return (
        <main className="flex w-full max-w-md flex-grow flex-col items-center justify-center gap-4 px-margin-mobile py-stack-lg text-center">
            <span className="material-symbols-outlined text-5xl text-muted">search_off</span>
            <h1 className="font-headline-md text-headline-md text-foreground">{t("title")}</h1>
            <p className="text-sm text-muted">{t("description")}</p>
        </main>
    );
}

function ageFromBirthDate(birthDate: string | null) {
    if (!birthDate) return null;
    const years = Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const formatted = new Date(birthDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
    return { years, formatted };
}

export function PetDetailViewPublic({ petCode }: { petCode: string }) {
    const { data: pet, isLoading, isError } = usePublicPet(petCode);
    const age = pet ? ageFromBirthDate(pet.dateOfBirth) : null;
    const t = useTranslations();
    const tPublic = useTranslations("PublicPet");
    const { mutateAsync: shareLocation, isPending } = useShareLocation();

    const statusMeta: Record<PetStatus, { label: string; chipColor: "success" | "danger" | "default" }> = {
        ACTIVE: { label: t("safe"), chipColor: "success" },
        LOST: { label: t("lost"), chipColor: "danger" },
        DECEASED: { label: t("deceased"), chipColor: "default" },
    };

    const handleShareLocation = async () => {
        try {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { success } = await shareLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        petCode,
                    });
                    if (success) {
                        toast.success(tPublic("actions.toastSuccess"));
                    }
                },
                (error) => console.error("Geolocation error:", error),
            );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center bg-surface text-foreground p-4">
            {isLoading ? (
                <PublicPetSkeleton />
            ) : isError || !pet ? (
                <PublicPetNotFound />
            ) : (
                <main className="flex w-full max-w-2xl flex-grow flex-col gap-6 pb-8">
                    <PublicPetHero
                        petCode={pet.petCode}
                        petName={pet.name}
                        coverUrl={pet.coverUrl}
                        avatarUrl={pet.avatarUrl}
                    />

                    <div className="xl:mt-24 mt-14 flex flex-col gap-6 px-margin-mobile md:px-margin-desktop">
                        <div className=" flex flex-col items-center gap-2 text-center">
                            {pet.status === "LOST" && <PublicLostBanner petName={pet.name} />}

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <h1 className="font-headline-xl text-headline-xl leading-none text-foreground">
                                    {pet.name}
                                </h1>
                                <Chip
                                    color={statusMeta[pet.status].chipColor === "default" ? undefined : statusMeta[pet.status].chipColor}
                                    className="gap-1"
                                >
                                    <CheckCircledIcon className="h-3.5 w-3.5" />
                                    <Chip.Label>{statusMeta[pet.status].label}</Chip.Label>
                                </Chip>
                            </div>
                            {/* <p className="text-sm text-muted">{getPetSubtitle(pet)}</p> */}

                            {pet.description && (
                                <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-separator bg-background-secondary px-4 py-2 font-body-md text-body-md italic text-foreground">
                                    <span className="text-lg text-muted">&ldquo;</span>
                                    {pet.description}
                                </p>
                            )}
                        </div>

                        <PublicPetInfoGrid
                            columns={[
                                [
                                    { icon: "pets", iconTone: "success", label: tPublic("infoGrid.species"), value: pet.species ?? tPublic("infoGrid.notAvailable") },
                                    { icon: "male", iconTone: "indigo", label: tPublic("infoGrid.gender"), value:  pet.gender === "MALE" ? t("PetDetail.overview.atAGlance.male") : pet.gender === 'FEMALE' ?  t("PetDetail.overview.atAGlance.female") : tPublic("infoGrid.unknown") },
                                ],
                                [
                                    { icon: "pet_supplies", iconTone: "accent", label: tPublic("infoGrid.breed"), value: pet.breed ?? tPublic("infoGrid.notAvailable") },
                                    { icon: "memory", iconTone: "amber", label: tPublic("infoGrid.microchip"), value: tPublic("infoGrid.microchipRegistered") },
                                ],
                                [
                                    {
                                        icon: "calendar_month",
                                        iconTone: "danger",
                                        label: tPublic("infoGrid.birthdateAge"),
                                        value: age ? tPublic("infoGrid.yearsOld", { years: age.years }) : tPublic("infoGrid.notAvailable"),
                                    },
                                    { icon: "monitor_weight", iconTone: "blue", label: tPublic("infoGrid.weight"), value: tPublic("infoGrid.notAvailable") },
                                ],
                            ]}
                        />

                        {pet.superOwner && (
                            <PublicContactOwnerCard
                                ownerPhone={pet.superOwner.user?.phoneNumber}
                                zaloNumber={pet.superOwner.user?.zaloNumber}
                                whatsAppNumber={pet.superOwner.user?.whatAppsNumber}
                            />
                        )}

                        <PublicPetActions
                            petName={pet.name}
                            isPendingShare={isPending}
                            onShareLocation={handleShareLocation}
                            onShareOtherApps={() => {
                                if (navigator.share) {
                                    navigator.share({ title: `Found ${pet.name}`, url: window.location.href });
                                }
                            }}
                        />

                        <div className="flex flex-col items-center gap-2 rounded-2xl bg-[color:var(--color-success-soft-hover)]/30 p-5">
                            <div className="flex items-center gap-2 text-[color:var(--color-success-soft-foreground)]">
                                <LockClosedIcon className="h-4 w-4" />
                                <span className="text-xs font-bold tracking-wide">
                                    {tPublic("footer.verified")}
                                </span>
                            </div>
                            <p className="text-xs text-muted opacity-70">{tPublic("footer.encrypted")}</p>
                        </div>
                    </div>
                </main>
            )}
        </div>
    );
}
// app/create-pet/components/CreatePetSuccess.tsx
"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { Button } from "@heroui/react";
import { PetQRCode } from "./PetQRCode";
import { CheckCircledIcon } from "@radix-ui/react-icons";

interface CreatePetSuccessProps {
    petName: string;
    species: string;
    breed: string;
    photoUrl: string | null;
    petCode: string;
    onAddAnother: () => void;
}

export function CreatePetSuccess({
    petName,
    species,
    breed,
    photoUrl,
    petCode,
    onAddAnother,
}: CreatePetSuccessProps) {
    const router = useRouter()
    return (
        <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-success-soft-hover)]">
                    <CheckCircledIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="mb-1  font-headline-lg-mobile text-headline-lg-mobile text-foreground md:font-headline-lg md:text-headline-lg">
                    Pet profile created!
                </h1>
                <p className="font-body-md text-body-md text-muted">
                    {petName}&apos;s digital identity is ready to use.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-separator bg-surface shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col items-center gap-5 p-6 text-center md:flex-row md:items-start md:text-left md:p-8">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-[color:var(--color-accent-soft-hover)]">
                        {photoUrl ? (
                            <img src={photoUrl} alt={petName} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <span className="material-symbols-outlined text-[32px] text-[color:var(--color-accent-soft-foreground)]">
                                    pets
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <p className="font-label-sm text-label-sm uppercase tracking-wide text-muted">
                            Digital Identity
                        </p>
                        <h2 className="mt-1 font-headline-md text-headline-md text-foreground">
                            {petName}
                        </h2>
                        <p className="mt-0.5 font-body-md text-body-md text-muted">
                            {species}
                            {breed ? ` • ${breed}` : ""}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                            <span className="flex items-center gap-1 rounded-full bg-[color:var(--color-success-soft-hover)] px-3 py-1 font-label-sm text-label-sm font-semibold text-[color:var(--color-success-soft-foreground)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-success-soft-foreground)]" />
                                Active
                            </span>
                            <span className="rounded-full border border-separator bg-background-secondary px-3 py-1 font-label-sm text-label-sm font-semibold text-foreground">
                                ID: {petCode}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="border-t border-separator bg-background-secondary/50 p-6 md:p-8">
                    <PetQRCode petCode={petCode} />
                </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Button
                    onClick={() => router.replace(`${ROUTES.PETS}/${petCode}`)}
                    className="h-12 w-full bg-accent font-label-md text-label-md font-semibold text-accent-foreground hover:bg-[color:var(--color-accent-hover)]"
                >
                    View Pet Profile
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onPress={onAddAnother}
                    className="h-12 w-full font-label-md text-label-md font-semibold"
                >
                    Add Another Pet
                </Button>
            </div>

            <Link
                href="/order-tag"
                className="mt-4 flex items-center justify-center gap-1.5 font-label-md text-label-md font-semibold text-accent hover:underline"
            >
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                Order a physical ID tag for {petName}
            </Link>
        </div>
    );
}
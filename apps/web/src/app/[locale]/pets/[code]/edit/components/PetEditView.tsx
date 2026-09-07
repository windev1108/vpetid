// app/create-pet/page.tsx
"use client";

import { useState } from "react";
import { Pet } from "@/services/pets/types";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { usePet } from "@/services/pets/queries";
import { CreatePetForm } from "@/app/[locale]/create-pet/components/CreatePetForm";

type PetEditViewProps = {
    petCode: string;
};

export default function PetEditView({ petCode }: PetEditViewProps) {
    const { data: initPet } = usePet(petCode)
    const router = useRouter();

    function handleSaved(pet: Pet) {
        router.push(`${ROUTES.PETS}/${pet.petCode}`);
        return;
    }

    return (
        <div className="min-h-screen bg-surface text-foreground">
            <main className="mx-auto w-full xl:p-8 lg:p-6 p-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mb-6 flex items-center gap-1.5 font-label-md text-label-md text-muted transition-colors hover:text-foreground"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Back
                </button>

                <div className="relative mb-8 overflow-hidden">
                    <span className="mb-2 inline-block font-label-md text-label-md font-semibold text-accent">
                        Pet Identity
                    </span>
                    <h1 className="mb-2 font-headline-lg-mobile text-headline-lg-mobile text-foreground md:font-headline-lg md:text-headline-lg">
                        Edit Pet Profile
                    </h1>
                    <p className="max-w-xl font-body-md text-body-md text-muted">
                        {`Update ${initPet?.name ?? "your pet"}'s details below.`}
                    </p>
                </div>

                <CreatePetForm initPet={initPet} onSaved={handleSaved} />
            </main>
        </div>
    );
}
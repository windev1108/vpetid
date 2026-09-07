// app/create-pet/page.tsx
"use client";

import { useState } from "react";
import { CreatePetForm } from "./components/CreatePetForm";
import { CreatePetSuccess } from "./components/CreatePetSuccess";
import { Pet } from "@/services/pets/types";
import { useRouter } from "@/i18n/navigation";

type CreatePetPageProps = {
    /** Pass an existing pet to run this page in edit mode. */
    initPet?: Pet | null;
};

export default function CreatePetPage({ initPet }: CreatePetPageProps) {
    const [createdPet, setCreatedPet] = useState<Pet | null>(null);
    const router = useRouter();

    function handleSaved(pet: Pet) {
        setCreatedPet(pet);
    }

    return (
        <div className="min-h-screen bg-surface text-foreground">
            <main className="mx-auto w-full xl:p-8 lg:p-6 p-4">
                {createdPet ? (
                    <CreatePetSuccess
                        petName={createdPet.name}
                        species={createdPet.species ?? ""}
                        breed={createdPet.breed ?? ""}
                        photoUrl={createdPet.avatarUrl}
                        petCode={createdPet.petCode}
                        onAddAnother={() => setCreatedPet(null)}
                    />
                ) : (
                    <>
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
                                Create Pet Profile
                            </h1>
                            <p className="max-w-xl font-body-md text-body-md text-muted">
                                {"Enter your pet's details to create their secure digital identity."}
                            </p>
                        </div>

                        <CreatePetForm initPet={initPet} onSaved={handleSaved} />
                    </>
                )}
            </main>
        </div>
    );
}
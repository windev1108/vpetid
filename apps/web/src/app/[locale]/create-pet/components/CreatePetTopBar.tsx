// app/create-pet/components/CreatePetTopBar.tsx
"use client";

import { useRouter } from "@/i18n/navigation";

export function CreatePetTopBar() {
    const router = useRouter();

    return (
        <header className="fixed left-0 top-0 z-[200] flex h-16 w-full items-center justify-between border-b border-separator bg-surface px-margin-mobile shadow-sm md:px-margin-desktop">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="hidden h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary active:scale-95 md:flex"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="font-headline-md text-headline-md font-bold tracking-tight text-link">
                    PetID
                </div>
            </div>

            <div className="hidden items-center gap-2 md:flex">
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary active:scale-95"
                >
                    <span className="material-symbols-outlined">notifications</span>
                </button>
                <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary active:scale-95"
                >
                    <span className="material-symbols-outlined">account_circle</span>
                </button>
            </div>

            <button
                type="button"
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-background-secondary active:scale-95 md:hidden"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
        </header>
    );
}
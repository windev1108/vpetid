// app/dashboard/components/PetList.tsx
"use client";

import { useMemo, useState } from "react";
import PetCard from "@/app/components/common/PetCard";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { Pet } from "@/services/pets/types";
import { usePets } from "@/services/pets/queries";
import { useTranslations } from "next-intl";

type FilterKey = "all" | Pet["status"];



export function PetList({ pets }: { pets: Pet[] }) {
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<FilterKey>("all");
    const t = useTranslations()
    const FILTERS: { key: FilterKey; label: string }[] = [
        { key: "all", label: t("all") },
        { key: "ACTIVE", label: t("safe") },
        { key: "LOST", label: t("lost") },
        { key: "DECEASED", label: t("deceased") },
    ];
    const availableFilters = useMemo(() => {
        const statuses = new Set(pets.map((p) => p.status));
        return FILTERS.filter((f) => f.key === "all" || statuses.has(f.key as Pet["status"]));
    }, [pets]);

    const filteredPets = useMemo(() => {
        return pets.filter((pet) => {
            const matchesFilter = filter === "all" || pet.status === filter;
            const matchesQuery =
                query.trim() === "" ||
                pet.name.toLowerCase().includes(query.trim().toLowerCase()) ||
                pet?.breed?.toLowerCase().includes(query.trim().toLowerCase());
            return matchesFilter && matchesQuery;
        });
    }, [pets, filter, query]);

    if (pets.length === 0) {
        return (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-separator bg-surface px-6 py-16 text-center">
                <span className="material-symbols-outlined mb-3 text-4xl text-link">
                    pets
                </span>
                <h3 className="mb-1 font-headline-md text-[18px] font-semibold text-foreground">
                    {t("no_pets_found")}
                </h3>
                <p className="mb-6 max-w-sm font-body-md text-body-md text-muted">
                   {t("add_pet_subtitle")}
                </p>
                <Link
                    href={ROUTES.CREATE_PET}
                    className="rounded-lg bg-accent px-6 py-3 font-label-md text-label-md font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-[color:var(--color-accent-hover)]"
                >
                   {t("add_pet_button")}
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {availableFilters.map((f) => (
                        <button
                            key={f.key}
                            type="button"
                            onClick={() => setFilter(f.key)}
                            className={`rounded-full px-3.5 py-1.5 font-label-sm text-label-sm font-medium transition-colors ${filter === f.key
                                ? "bg-accent text-accent-foreground"
                                : "bg-background-secondary text-muted hover:bg-default hover:text-foreground"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-64">
                    <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-muted">
                        search
                    </span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("search_input_placeholder")}
                        className="w-full rounded-lg border border-separator bg-surface py-2 pl-9 pr-3 font-body-md text-body-md text-foreground outline-none transition-shadow placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30"
                    />
                </div>
            </div>

            {filteredPets.length === 0 ? (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-separator bg-surface px-6 py-12 text-center">
                    <span className="material-symbols-outlined mb-2 text-3xl text-muted">
                        search_off
                    </span>
                    <p className="font-body-md text-body-md text-muted">
                        {t("no_pets_found")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPets.map((pet) => (
                        <PetCard key={pet.id} pet={pet} />
                    ))}
                </div>
            )}
        </div>
    );
}
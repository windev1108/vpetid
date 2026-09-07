// app/pets/components/MyPetsContent.tsx
"use client";

import { useMemo, useState } from "react";
import { PetsHeader } from "./PetsHeader";
import { PetsToolbar, ViewMode } from "./PetsToolbar";
import { PetsGrid } from "./PetsGrid";
import { PetsListView } from "./PetsListView";
import { PetsEmptyState } from "./PetsEmptyState";
import { PetsEmptyFilterState } from "./PetsEmptyFilterState";
import { Pet } from "@/services/pets/types";

type FilterKey = "all" | Pet["status"];

type MyPetsContentProps = {
    pets: Pet[];
};

export default function MyPetsContent({ pets }: MyPetsContentProps) {
    const [filter, setFilter] = useState<FilterKey>("all");
    const [query, setQuery] = useState("");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const availableStatuses = useMemo(
        () => Array.from(new Set(pets.map((p) => p.status))),
        [pets]
    );

    const counts = useMemo(() => {
        const result: Record<string, number> = { all: pets.length };
        for (const status of availableStatuses) {
            result[status] = pets.filter((p) => p.status === status).length;
        }
        return result;
    }, [pets, availableStatuses]);

    const filteredPets = useMemo(() => {
        return pets.filter((pet) => {
            const matchesFilter = filter === "all" || pet.status === filter;
            const q = query.trim().toLowerCase();
            const matchesQuery =
                q === "" ||
                pet.name.toLowerCase().includes(q) ||
                pet.breed?.toLowerCase().includes(q);
            return matchesFilter && matchesQuery;
        });
    }, [pets, filter, query]);

    return (
        <div className="mx-auto w-full xl:p-8 lg:p-6 p-4">
            <PetsHeader total={pets.length}  />

            {pets.length === 0 ? (
                <PetsEmptyState />
            ) : (
                <>
                    <PetsToolbar
                        availableStatuses={availableStatuses}
                        filter={filter}
                        onFilterChange={setFilter}
                        query={query}
                        onQueryChange={setQuery}
                        counts={counts}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />

                    {filteredPets.length === 0 ? (
                        <PetsEmptyFilterState />
                    ) : viewMode === "grid" ? (
                        <PetsGrid pets={filteredPets} />
                    ) : (
                        <PetsListView pets={filteredPets} />
                    )}
                </>
            )}
        </div>
    );
}
// app/pets/components/PetsToolbar.tsx
"use client";

import { Button, Input } from "@heroui/react";
import { MagnifyingGlassIcon, DashboardIcon, ListBulletIcon } from "@radix-ui/react-icons";
import { Pet } from "@/services/pets/types";
import { useTranslations } from "next-intl";

type FilterKey = "all" | Pet["status"];
export type ViewMode = "grid" | "list";


type PetsToolbarProps = {
    availableStatuses: Pet["status"][];
    filter: FilterKey;
    onFilterChange: (filter: FilterKey) => void;
    query: string;
    onQueryChange: (query: string) => void;
    counts: Record<string, number>;
    viewMode: ViewMode;
    onViewModeChange: (mode: ViewMode) => void;
};

export function PetsToolbar({
    availableStatuses,
    filter,
    onFilterChange,
    query,
    onQueryChange,
    counts,
    viewMode,
    onViewModeChange,
}: PetsToolbarProps) {
    const filters: FilterKey[] = ["all", ...availableStatuses];
    const t = useTranslations()
    const FILTER_LABEL: Record<string, string> = {
        all: t("all"),
        ACTIVE: t("safe"),
        LOST: t("lost"),
        DECEASED: t("deceased"),
    };

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
                {filters.map((key) => {
                    const isActive = filter === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onFilterChange(key)}
                            className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 font-label-sm text-label-sm font-medium transition-colors ${isActive
                                ? "bg-accent text-accent-foreground"
                                : "bg-background-secondary text-muted hover:bg-default hover:text-foreground"
                                }`}
                        >
                            {FILTER_LABEL[key] ?? key}
                            <span
                                className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 font-label-sm text-[11px] font-semibold ${isActive
                                    ? "bg-white/25 text-accent-foreground"
                                    : "bg-surface text-foreground"
                                    }`}
                            >
                                {counts[key] ?? 0}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-64">
                    <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <Input
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        placeholder={t("search_input_placeholder")}
                        className="pl-9"
                        aria-label="Search by name or breed"
                    />
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-lg border border-separator bg-background-secondary p-1">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={viewMode === "grid" ? "primary" : "outline"}
                        className={viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted"}
                        onPress={() => onViewModeChange("grid")}
                        aria-label="Grid view"
                    >
                        <DashboardIcon className="h-4 w-4" />
                    </Button>
                    <Button
                        isIconOnly
                        size="sm"
                        variant={viewMode === "list" ? "primary" : "outline"}
                        className={viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted"}
                        onPress={() => onViewModeChange("list")}
                        aria-label="List view"
                    >
                        <ListBulletIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
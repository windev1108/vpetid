// app/pets/[petCode]/components/PetQuickStatsRow.tsx
"use client";

import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";
import { PetOverviewNote, PetOverviewVaccination, WeightUnit } from "@/services/pets/types";
import { Button } from "@heroui/react";

type PetQuickStatsRowProps = {
    nextVaccination: PetOverviewVaccination | null;
    weightGoal?: { current: number; target: number; unit: WeightUnit } | null;
    notes?: PetOverviewNote[];
    onViewVaccinations?: () => void;
    onUpdateWeight?: () => void;
    onAddNote?: () => void;
};

export function PetQuickStatsRow({
    nextVaccination,
    weightGoal,
    notes,
    onViewVaccinations,
    onUpdateWeight,
    onAddNote,
}: PetQuickStatsRowProps) {
    const t = useTranslations("PetDetail.quickStats");
    const weightPercent = weightGoal ? Math.min(100, Math.round((weightGoal.current / weightGoal.target) * 100)) : 0;

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Next Vaccination */}
            <div className="flex flex-col gap-3 rounded-xl border border-separator bg-surface p-5 shadow-level-1">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success-soft-hover)]">
                        <span className="material-symbols-outlined text-[20px] text-[color:var(--color-success-soft-foreground)]">
                            vaccines
                        </span>
                    </div>
                    <div className="flex flex-col max-h-32 overflow-y-auto">
                        <p className="font-label-sm text-label-sm text-muted">{t("nextVaccination")}</p>
                        <p className="font-headline-md text-sm font-bold text-foreground">
                            {nextVaccination
                                ? `${nextVaccination?.vaccineName} • ${formatDate(nextVaccination?.nextDueAt ?? "")}`
                                : t("noneUpcoming")}
                        </p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onPress={onViewVaccinations} className="self-end">
                    {t("viewAll")}
                </Button>
            </div>

            {/* Weight Goal */}
            <div className="flex flex-col gap-3 rounded-xl border border-separator bg-surface p-5 shadow-level-1">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-accent-soft-hover)]">
                        <span className="material-symbols-outlined text-[20px] text-[color:var(--color-accent-soft-foreground)]">
                            monitor_weight
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="font-label-sm text-label-sm text-muted">{t("weightGoal")}</p>
                        <p className="font-headline-md text-md font-bold text-foreground">
                            {weightGoal ? `${weightGoal.current} kg / ${weightGoal.target} kg` : "—"}
                        </p>
                    </div>
                </div>
                {weightGoal && (
                    <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-secondary">
                            <div className="h-full rounded-full bg-accent" style={{ width: `${weightPercent}%` }} />
                        </div>
                        <span className="font-label-sm text-label-sm font-semibold text-muted">{weightPercent}%</span>
                    </div>
                )}
                <Button variant="outline" size="sm" onPress={onUpdateWeight} className="self-end">
                    {t("update")}
                </Button>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-3 rounded-xl border border-separator bg-surface p-5 shadow-level-1">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                        <span className="material-symbols-outlined text-[20px] text-amber-600">sticky_note_2</span>
                    </div>
                    <div>
                        <p className="font-label-sm text-label-sm text-muted">{t("notes")}</p>
                        {notes?.length === 0 ? (
                            <p className="font-headline-md text-sm text-foreground">{t("noNotes")}</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {notes?.map((item) => (
                                    <div key={item.id} className="flex flex-col gap-2">
                                        <p className="font-headline-md text-xl font-bold text-foreground">{item.title}</p>
                                        <p className="font-headline-md text-sm font-base text-foreground">{item.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <Button variant="outline" size="sm" onPress={onAddNote} className="self-end">
                    {t("addNote")}
                </Button>
            </div>
        </div>
    );
}
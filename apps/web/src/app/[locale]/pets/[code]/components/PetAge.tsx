"use client";

import { calculatePetAge } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PetAgeProps {
    birthdate?: string | Date | null;
}

export function PetAge({ birthdate }: PetAgeProps) {
    const t = useTranslations("Pet.identity");
    const age = calculatePetAge(birthdate);

    if (!age) {
        return <span>—</span>;
    }

    let ageLabel: string;

    if (age.years > 0) {
        ageLabel = t("age.year", {
            count: age.years,
        });
    } else if (age.months > 0) {
        ageLabel = t("age.month", {
            count: age.months,
        });
    } else {
        ageLabel = t("age.day", {
            count: Math.max(age.days, 0),
        });
    }

    return (
        <div>
            <p className="font-semibold text-foreground">
                {ageLabel}
            </p>

            <p className="text-xs text-muted">
                {new Intl.DateTimeFormat(undefined, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }).format(new Date(birthdate!))}
            </p>
        </div>
    );
}
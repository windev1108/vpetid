// app/pets/components/PetsListView.tsx
"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage, Button, Chip } from "@heroui/react";
import {
    EyeOpenIcon,
    Pencil1Icon,
    DotsVerticalIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckCircledIcon,
    Crosshair2Icon,
} from "@radix-ui/react-icons";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { Pet } from "@/services/pets/types";

const STATUS_KEY: Record<Pet["status"], "active" | "lost" | "pending"> = {
    ACTIVE: "active",
    LOST: "lost",
    DECEASED: "pending",
};

const STATUS_CHIP_CLASS: Record<Pet["status"], string> = {
    ACTIVE: "bg-[color:var(--color-success-soft-hover)] text-white",
    LOST: "bg-[color:var(--color-danger-soft-hover)] text-[color:var(--color-danger-soft-foreground)]",
    DECEASED: "bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]",
};

export function PetsListView({ pets }: { pets: Pet[] }) {
    const router = useRouter();
    const t = useTranslations("Pet");

    function ageFromBirthDate(birthDate: string | null) {
        if (!birthDate) return t("table.notAvailable");
        const years = Math.floor(
            (Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
        );
        return years < 1
            ? t("identity.age.lessThanYear")
            : t("identity.age.year", { count: years });
    }

    const COLUMNS = [
        t("table.columns.pet"),
        t("table.columns.breed"),
        t("table.columns.gender"),
        t("table.columns.age"),
        t("table.columns.status"),
        t("table.columns.idTag"),
        t("table.columns.actions"),
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-separator bg-surface">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-separator bg-background-secondary">
                            {COLUMNS.map((col) => (
                                <th
                                    key={col}
                                    className="whitespace-nowrap px-6 py-3 font-label-sm text-label-sm font-semibold text-muted"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pets.map((pet) => (
                            <tr key={pet.id} className="border-b border-separator last:border-0 hover:bg-background-secondary/50">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar size="lg">
                                            <AvatarImage src={pet.avatarUrl ?? ""} />
                                            <AvatarFallback>
                                                {pet?.name[0] ?? 'N/A'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-label-md text-label-md font-semibold text-foreground">
                                                {pet.name}
                                            </div>
                                            <div className="font-label-sm text-label-sm text-muted">
                                                ID: {pet.petCode}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-body-md text-body-md text-foreground">
                                    {pet.breed ?? t("table.notAvailable")}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-body-md text-body-md text-foreground">
                                    {pet.gender ? pet.gender.charAt(0) + pet.gender.slice(1).toLowerCase() : t("table.notAvailable")}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 font-body-md text-body-md text-foreground">
                                    {ageFromBirthDate(pet.dateOfBirth)}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <Chip
                                        size="sm"
                                        className={`gap-1 font-label-sm font-semibold ${STATUS_CHIP_CLASS[pet.status]}`}
                                    >
                                        <span className="flex items-center gap-1">
                                            <CheckCircledIcon className="h-3 w-3" />
                                            {t(`table.status.${STATUS_KEY[pet.status]}`)}
                                        </span>
                                    </Chip>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="flex items-center gap-1.5 font-body-md text-body-md text-[color:var(--color-success-soft-foreground)]">
                                        <Crosshair2Icon className="h-4 w-4" />
                                        {pet.isPublicProfile ? t("table.idActivated") : t("table.idNotActivated")}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="ghost"
                                            aria-label={t("table.viewProfile")}
                                            onPress={() => router.push(`${ROUTES.PETS}/${pet.petCode}`)}
                                        >
                                            <EyeOpenIcon className="h-4 w-4 text-muted" />
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="ghost"
                                            aria-label={t("table.editDetails")}
                                            onPress={() => router.push(`${ROUTES.PETS}/${pet.petCode}/edit`)}
                                        >
                                            <Pencil1Icon className="h-4 w-4 text-muted" />
                                        </Button>
                                        <Button isIconOnly size="sm" variant="ghost" aria-label={t("table.moreActions")}>
                                            <DotsVerticalIcon className="h-4 w-4 text-muted" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-separator px-6 py-3">
                <span className="font-label-sm text-label-sm text-muted">
                    {t("table.showing", { count: pets.length, total: pets.length })}
                </span>
                <div className="flex items-center gap-1">
                    <Button isIconOnly size="sm" variant="ghost" isDisabled aria-label={t("table.previousPage")}>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="bg-accent text-accent-foreground min-w-8">
                        1
                    </Button>
                    <Button isIconOnly size="sm" variant="ghost" isDisabled aria-label={t("table.nextPage")}>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
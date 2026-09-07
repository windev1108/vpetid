// app/components/common/PetCard.tsx
"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@heroui/react";
import { Pet } from "@/services/pets/types";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { useTranslations } from "next-intl";

type PetCardProps = {
    pet: Pet;
};




const STATUS_DOT_CLASS: Record<Pet["status"], string> = {
    ACTIVE: "bg-white",
    LOST: "bg-danger",
    DECEASED: "bg-[color:var(--color-accent-soft-foreground)]",
};

const STATUS_BADGE_CLASS: Record<Pet["status"], string> = {
    ACTIVE: "bg-[color:var(--color-success-soft-hover)] text-white",
    LOST: "bg-[color:var(--color-danger-soft-hover)] text-[color:var(--color-danger-soft-foreground)]",
    DECEASED: "bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]",
};

// Viền/glow theo status — pet đang lost/alert nổi bật hẳn ra khỏi lưới card
const STATUS_RING_CLASS: Record<Pet["status"], string> = {
    ACTIVE: "border-separator hover:border-[color:var(--color-success-soft-foreground)]/40",
    DECEASED: "border-separator hover:border-[color:var(--color-accent-soft-foreground)]/40",
    LOST: "border-danger/30 hover:border-danger/60 ring-1 ring-danger/10",
};

function batteryIconFor(level: number) {
    if (level >= 90) return "battery_full";
    if (level >= 70) return "battery_5_bar";
    if (level >= 50) return "battery_4_bar";
    if (level >= 30) return "battery_3_bar";
    if (level >= 15) return "battery_2_bar";
    return "battery_1_bar";
}

function batteryColorFor(level: number) {
    if (level === 0) return "text-muted";
    if (level < 20) return "text-danger";
    return "text-[color:var(--color-success-soft-foreground)]";
}

export default function PetCard({ pet }: PetCardProps) {
    const isUrgent = pet.status === "DECEASED" || pet.status === "LOST";
    const router = useRouter()
    const t = useTranslations()

    const STATUS_LABEL: Record<Pet["status"], string> = {
        ACTIVE: t("safe"),
        LOST: t("lost"),
        DECEASED: t("deceased"),
    };
    return (
        <motion.article
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`group relative flex flex-col overflow-hidden rounded-[24px] border bg-surface p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] transition-colors duration-200 hover:shadow-[0px_12px_32px_rgba(15,23,42,0.1)] ${STATUS_RING_CLASS[pet.status]}`}
        >
            {/* Top accent bar — màu theo status, chỉ thấy rõ khi hover */}
            <span
                className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100 ${isUrgent ? "bg-danger" : "bg-accent"
                    }`}
            />

            {isUrgent && (
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute right-4 top-4 flex h-2.5 w-2.5 rounded-full bg-danger"
                />
            )}

            <div className="mb-6 flex items-start gap-4">
                <Avatar className="w-24 h-24 rounded-full">
                    <AvatarImage src={pet.avatarUrl ?? ""} />
                    <AvatarFallback className="text-2xl">
                        {pet.name ? pet.name[0]?.toUpperCase() : "N/A"}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h2 className="truncate font-headline-md text-headline-md text-foreground">
                                {pet.name}
                            </h2>
                            <p className="truncate font-body-md text-body-md text-muted">
                                {pet.breed}
                            </p>
                        </div>
                        <span
                            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1 font-label-sm text-label-sm font-semibold ${STATUS_BADGE_CLASS[pet.status]}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT_CLASS[pet.status]}`} />
                            {STATUS_LABEL[pet.status]}
                        </span>
                    </div>

                    <div className="mt-2 inline-block rounded border border-separator bg-background-secondary px-2 py-1">
                        <p className="font-label-sm text-label-sm tracking-wide text-default-foreground">
                            ID: {pet.petCode}
                        </p>
                    </div>
                </div>
            </div>

            {/* <div className="mb-6 grid grid-cols-2 gap-4 border-t border-separator pt-4">
                <div className="flex items-center gap-2">
                    <span
                        className={`material-symbols-outlined text-[20px] ${pet.gpsConnected ? "text-[color:var(--color-success-soft-foreground)]" : "text-muted"
                            }`}
                    >
                        gps_fixed
                    </span>
                    <span className="font-label-md text-label-md text-foreground">
                        {pet.gpsConnected ? "GPS Connected" : "GPS Offline"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[20px] ${batteryColorFor(pet.batteryLevel)}`}>
                        {batteryIconFor(pet.batteryLevel)}
                    </span>
                    <span className="font-label-md text-label-md text-foreground">
                        {pet.batteryLevel}%
                    </span>
                </div>
            </div> */}

            <div className="mt-auto flex gap-3">
                <Button className="w-1/2 gap-1.5" onClick={() => router.push(`${ROUTES.PETS}/${pet?.petCode}`)}>
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    {t("view_profile_button")}
                </Button>
                <Button className="w-1/2 gap-1.5" variant="secondary" type="button" onClick={() => router.push(`${ROUTES.PETS}/${pet?.petCode}/edit`)}>
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    {t("edit_pet_button")}
                </Button>
            </div>
        </motion.article>
    );
}
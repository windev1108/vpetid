"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@heroui/react";

export function MobileHeader({ title }: { title: string }) {
    const t = useTranslations("PetDetail");
    const router = useRouter();

    return (
        <header className="mb-6 flex items-center justify-between border-b border-separator/20 pb-4 md:hidden">
            <div className="flex items-center gap-2">
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    aria-label={t("goBack")}
                    className="-ml-2"
                    onPress={() => router.back()}
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                </Button>
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
            </div>
        </header>
    );
}
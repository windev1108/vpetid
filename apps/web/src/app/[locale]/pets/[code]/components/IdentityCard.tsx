"use client";

import { useTranslations } from "next-intl";
import { statusMeta } from "@/services/pets/display";
import { Pet } from "@/services/pets/types";
import { Button, Card } from "@heroui/react";
import QRCode from "react-qr-code";

export function IdentityCard({ pet }: { pet: Pet }) {
    const status = statusMeta[pet.status];
    const t = useTranslations("PetDetail.identityCard");
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const petUrl = `${baseUrl}/public/${pet?.petCode}`;

    return (
        <Card variant="default" className="flex flex-col border border-separator p-6 shadow-level-1 md:col-span-1">
            <Card.Header className="mb-6 flex-row items-center justify-between p-0">
                <Card.Title className="text-xl font-semibold text-foreground">{t("title")}</Card.Title>
                <Button isIconOnly variant="ghost" size="sm" aria-label={t("expand")}>
                    <span className="material-symbols-outlined text-muted">open_in_full</span>
                </Button>
            </Card.Header>

            <Card.Content className="flex flex-1 flex-col items-center justify-center gap-4 p-0">
                <QRCode value={petUrl} size={180} bgColor="#ffffff" fgColor="#111827" level="H" />
                <p className="px-4 text-center text-xs text-muted">{t("scanHint")}</p>
                <Button variant="secondary" fullWidth>
                    {t("download")}
                </Button>
            </Card.Content>

            <Card.Footer className="mt-6 flex-col items-stretch gap-3 border-t border-separator p-0 pt-4">
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-muted">
                        <span className="material-symbols-outlined text-[16px]">tag</span>
                        {t("petCode")}
                    </span>
                    <span className="font-mono text-sm text-foreground">{pet.petCode}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-muted">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span>
                        {t("status")}
                    </span>
                    <span
                        className={
                            status.chipColor === "success"
                                ? "text-sm font-medium text-success"
                                : status.chipColor === "danger"
                                    ? "text-sm font-medium text-danger"
                                    : "text-sm font-medium text-muted"
                        }
                    >
                        {status.label}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-muted">
                        <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                        {t("registered")}
                    </span>
                    <span className="text-sm text-foreground">
                        {new Date(pet.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </Card.Footer>
        </Card>
    );
}
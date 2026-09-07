// app/pets/[petCode]/components/DeletePetConfirmDialog.tsx
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";

type DeletePetConfirmDialogProps = {
    petName: string;
    isOpen: boolean;
    isPending: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export function DeletePetConfirmDialog({
    petName,
    isOpen,
    isPending,
    onCancel,
    onConfirm,
}: DeletePetConfirmDialogProps) {
    const t = useTranslations("PetDetail.deleteDialog");
    if (!isOpen) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            onClick={onCancel}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-2xl border border-separator bg-surface p-6 shadow-[0px_12px_32px_rgba(15,23,42,0.15)]"
            >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-danger-soft-hover)]">
                    <span className="material-symbols-outlined text-[24px] text-[color:var(--color-danger-soft-foreground)]">
                        warning
                    </span>
                </div>

                <h3 className="mb-1 font-headline-md text-headline-md text-foreground">
                    {t("title", { name: petName })}
                </h3>
                <p className="mb-6 font-body-md text-body-md text-muted">
                    {t("description", { name: petName })}
                </p>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onPress={onCancel}
                        isDisabled={isPending}
                        className="flex-1"
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        type="button"
                        onPress={onConfirm}
                        isPending={isPending}
                        className="flex-1 bg-danger text-danger-foreground hover:bg-[color:var(--color-danger-hover)]"
                    >
                        {t("confirm")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
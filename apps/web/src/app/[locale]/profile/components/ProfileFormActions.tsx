"use client";

import { Button } from "@heroui/react";
import { CheckIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type ProfileFormActionsProps = {
    isPending: boolean;
    isDirty: boolean;
};

export function ProfileFormActions({
    isPending,
    isDirty,
}: ProfileFormActionsProps) {
    const t = useTranslations("Profile.formActions");

    return (
        <div className="flex items-center justify-end gap-3">
            {isDirty && (
                <span className="font-label-sm text-label-sm text-muted">
                    {t("unsavedChanges")}
                </span>
            )}

            <Button
                isDisabled={!isDirty || isPending}
                type="submit"
                isPending={isPending}
                className="flex items-center gap-2 bg-accent px-6 font-label-md text-label-md font-semibold text-accent-foreground hover:bg-[color:var(--color-accent-hover)]"
            >
                <CheckIcon className="h-4 w-4" />
                {isPending
                    ? t("saving")
                    : t("saveChanges")}
            </Button>
        </div>
    );
}

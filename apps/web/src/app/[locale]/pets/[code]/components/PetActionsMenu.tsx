// app/pets/[petCode]/components/PetActionsMenu.tsx
"use client";

import { useTranslations } from "next-intl";
import { Menu, Dropdown } from "@heroui/react";
import {
    DotsVerticalIcon,
    ExclamationTriangleIcon,
    Share1Icon,
    Pencil1Icon,
    TargetIcon,
    TrashIcon,
} from "@radix-ui/react-icons";

type PetActionsMenuProps = {
    onLostMode: () => void;
    onShare: () => void;
    onEdit: () => void;
    onTrack: () => void;
    onDelete: () => void;
};

export function PetActionsMenu({ onLostMode, onShare, onEdit, onTrack, onDelete }: PetActionsMenuProps) {
    const t = useTranslations("PetDetail.actionsMenu");

    return (
        <Dropdown>
            <Dropdown.Trigger className={'p-2 rounded-full bg-background'}>
                <DotsVerticalIcon className="h-4 w-4" />
            </Dropdown.Trigger>

            <Dropdown.Popover className="bg-background">
                <Dropdown.Menu>
                    <Dropdown.Item onAction={onEdit} className="flex items-center gap-2">
                        <Pencil1Icon className="h-4 w-4" />
                        {t("editDetails")}
                    </Dropdown.Item>
                    <Dropdown.Item onAction={onTrack} className="flex items-center gap-2">
                        <TargetIcon className="h-4 w-4" />
                        {t("track")}
                    </Dropdown.Item>
                    <Dropdown.Item onAction={onShare} className="flex items-center gap-2">
                        <Share1Icon className="h-4 w-4" />
                        {t("share")}
                    </Dropdown.Item>
                    <Dropdown.Item
                        onAction={onLostMode}
                        className="flex items-center gap-2 text-[color:var(--color-danger-soft-foreground)]"
                    >
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        {t("lostMode")}
                    </Dropdown.Item>
                    <Dropdown.Item onAction={onDelete} className="flex items-center gap-2 text-danger">
                        <TrashIcon className="h-4 w-4" />
                        {t("deletePet")}
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
}
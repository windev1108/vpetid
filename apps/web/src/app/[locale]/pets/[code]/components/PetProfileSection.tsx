"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Avatar, Button, Card, Chip, Tabs } from "@heroui/react";
import { getPetSubtitle } from "@/services/pets/display";
import { Pet, PetStatus } from "@/services/pets/types";
import { petTabs } from "@/services/pets/const";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { useDeletePet } from "@/services/pets/mutations";
import { useState } from "react";
import toast from "react-hot-toast";
import { PetActionsMenu } from "./PetActionsMenu";
import { DeletePetConfirmDialog } from "./DeletePetConfirmDialog";
import { HealthTab } from "./HealthTab";
import { IdentityTab } from "./IdentityTab";
import OverviewTab from "./OverviewTab";
import { CalendarDaysIcon, GlobeIcon, IdCardIcon, SummaryIcon } from "lucide-react";

const TAB_LABEL_KEY: Record<string, string> = {
    overview: "tabs.overview",
    identity: "tabs.identity",
    schedule: "tabs.schedule",
};

export function PetProfileSection({ pet }: { pet: Pet }) {
    const t = useTranslations("PetDetail");
    const tCommon = useTranslations("");
    const statusMeta: Record<PetStatus, { label: string; chipColor: "success" | "danger" | "default" }> = {
        ACTIVE: { label: tCommon("safe"), chipColor: "success" },
        LOST: { label: tCommon("lost"), chipColor: "danger" },
        DECEASED: { label: tCommon("deceased"), chipColor: "default" },
    };
    const status = statusMeta[pet.status];
    const router = useRouter();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { mutateAsync: deletePet, isPending: isDeleting } = useDeletePet();

    async function handleDeleteConfirm() {
        try {
            await deletePet(pet.id);
            router.push(ROUTES.PETS);
            toast.success(t("deleteDialog.confirm") + " ✓");
        } catch (error) {
            console.error("Failed to delete pet:", error);
        }
    }

    return (
        <>
            <Tabs variant="secondary" defaultSelectedKey="overview" className="flex flex-col gap-stack-lg">
                <Card variant="default" className="overflow-hidden border border-separator p-0 shadow-level-1">
                    <Card.Content className="relative flex min-h-48 flex-col justify-end overflow-hidden p-0 md:min-h-64">
                        <div className="absolute inset-0 z-0">
                            {pet.coverUrl ? (
                                <Image src={pet.coverUrl} alt={pet.name} fill unoptimized className="object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-success/20">
                                    <span className="material-symbols-outlined text-6xl text-accent/40">pets</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>

                        <div className="relative z-10 flex flex-col justify-between gap-4 p-6 md:flex-row md:items-end">
                            <div className="flex items-end gap-6">
                                <Avatar className="h-24 w-24 shrink-0 border-4 border-surface shadow-lg md:h-32 md:w-32" size="lg">
                                    {pet.avatarUrl && <Avatar.Image src={pet.avatarUrl} alt={pet.name} />}
                                    <Avatar.Fallback>{pet.name.slice(0, 1).toUpperCase()}</Avatar.Fallback>
                                </Avatar>

                                <div className="pb-2 text-white">
                                    <div className="mb-1 flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl font-bold md:text-[40px]">{pet.name}</h1>
                                        <Chip color={status.chipColor === "default" ? undefined : status.chipColor} className="gap-1">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                            <Chip.Label>{status.label}</Chip.Label>
                                        </Chip>
                                    </div>
                                    <p className="text-base text-white/90">{getPetSubtitle(pet)}</p>
                                    <p className="mt-1 font-mono text-xs text-white/70">Code: {pet.petCode}</p>
                                </div>
                            </div>

                            <div className="flex w-full items-center gap-3 pb-2 md:w-auto">
                                {pet.isPublicProfile && (
                                    <Button
                                        onClick={() => window.open(`${ROUTES.PUBLIC}/${pet.petCode}`)}
                                        variant="tertiary"
                                        size="sm"
                                        className="shrink-0 gap-2"
                                    >
                                        <GlobeIcon />
                                        {t("header.previewProfile")}
                                    </Button>
                                )}
                                <PetActionsMenu
                                    onLostMode={() => {
                                        // TODO: nối vào flow bật Lost Mode thật
                                    }}
                                    onShare={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: pet.name, url: `${ROUTES.PUBLIC}/${pet.petCode}` });
                                        }
                                    }}
                                    onEdit={() => router.replace(`${ROUTES.PETS}/${pet.petCode}/edit`)}
                                    onTrack={() => {
                                        // TODO: nối vào flow Track khi GPS feature ra mắt
                                    }}
                                    onDelete={() => setIsDeleteDialogOpen(true)}
                                />
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                <Tabs.ListContainer className="mt-4 rounded-full border-t border-separator bg-surface">
                    <Tabs.List aria-label="Pet profile sections" className="w-full">
                        {petTabs.map((tab) => (
                            <Tabs.Tab
                                key={tab.id}
                                id={tab.id}
                                className="
                    relative flex-1 px-3 py-4 text-sm font-medium text-muted transition-colors
                    data-[selected=true]:text-foreground
                    after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-0 after:-translate-x-1/2
                    after:rounded-full after:bg-accent after:transition-all
                    data-[selected=true]:after:w-24 md:data-[selected=true]:after:w-32
                "
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {tab.icon === 'schedule' && <CalendarDaysIcon />}
                                    {tab.icon === 'identity' && <IdCardIcon />}
                                    {tab.icon === 'summary' && <SummaryIcon />}
                                    <span className="hidden sm:inline">
                                        {t(TAB_LABEL_KEY[tab.id] ?? "tabs.overview")}
                                    </span>
                                </div>
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                </Tabs.ListContainer>

                {petTabs.map((tab) => {
                    if (tab.id === "overview") {
                        return (
                            <Tabs.Panel key={tab.id} id={tab.id} className="w-full">
                                <OverviewTab pet={pet} />
                            </Tabs.Panel>
                        );
                    }
                    if (tab.id === "identity") {
                        return (
                            <Tabs.Panel key={tab.id} id={tab.id} className="w-full">
                                <IdentityTab pet={pet} />
                            </Tabs.Panel>
                        );
                    }
                    if (tab.id === "schedule") {
                        return (
                            <Tabs.Panel key={tab.id} id={tab.id} className="w-full">
                                <HealthTab pet={pet} />
                            </Tabs.Panel>
                        );
                    }

                    return (
                        <Tabs.Panel
                            key={tab.id}
                            id={tab.id}
                            className="rounded-2xl border border-dashed border-separator p-16 text-center text-sm text-muted"
                        >
                            {t("tabs.comingSoon", { label: tab.label })}
                        </Tabs.Panel>
                    );
                })}
            </Tabs>

            <DeletePetConfirmDialog
                petName={pet.name}
                isOpen={isDeleteDialogOpen}
                isPending={isDeleting}
                onCancel={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
"use client";

import { useTranslations } from "next-intl";
import { Button, Card, Switch } from "@heroui/react";
import { Pet } from "@/services/pets/types";
import { usePetOverview } from "@/services/pets/queries";
import { formatDate, getMutateError, getPetAge } from "@/lib/utils";
import { LocationCard } from "./LocationCard";
import { ContactIcon, DogIcon, NotebookIcon, Syringe, UserShieldIcon, WeightIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useTogglePublicPetProfile } from "@/services/pets/mutations";

type OverviewTabProps = { pet: Pet };

export default function OverviewTab({ pet }: OverviewTabProps) {
    const { data: overview } = usePetOverview(pet.petCode);
    const birthDate = pet.dateOfBirth ? new Date(pet.dateOfBirth) : null;
    const age = birthDate ? getPetAge(birthDate) : null;

    return (
        <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <AtAGlanceCard pet={pet} age={age} />
                <LocationCard />
                <ProfileVisibilityCard pet={pet} />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <VaccinationCard vaccination={overview?.nextVaccination ?? null} />
                <WeightGoalCard current={pet.weight ?? 0} target={overview?.weightGoal ?? 0} unit={pet.weightUnit ?? "KG"} />
                <NotesCard notes={overview?.notes ?? []} />
            </div>

            <PetStatusCard pet={pet} />
        </div>
    );
}

function AtAGlanceCard({ pet, age }: { pet: Pet; age: string | null }) {
    const t = useTranslations("PetDetail.overview.atAGlance");

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <DogIcon className="text-success" />
                    <div>
                        <h3 className="font-semibold text-foreground">{t("title")}</h3>
                        <p className="text-xs text-muted">{t("subtitle", { name: pet.name })}</p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-muted">open_in_full</span>
            </div>

            <div className="grid grid-cols-2 gap-x-6">
                <InfoItem icon="pets" label={t("species")} value={pet.species || "—"} />
                <InfoItem
                    icon="calendar_month"
                    label={t("birthdateAge")}
                    value={age ? age : pet.dateOfBirth ? formatDate(pet.dateOfBirth) : "—"}
                />
                <InfoItem icon="category" label={t("breed")} value={pet.breed || "—"} />
                <InfoItem
                    icon="monitor_weight"
                    label={t("weight")}
                    value={pet.weight ? `${pet.weight} ${pet.weightUnit || "kg"}` : "—"}
                />
                <InfoItem icon="male" label={t("gender")} value={pet.gender === "MALE" ? t("male") : pet.gender === 'FEMALE' ?  t("female") : "—"} />
            </div>
        </Card>
    );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 border-b border-separator py-3 last:border-b-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background-secondary text-accent">
                <span className="material-symbols-outlined text-[18px]">{icon}</span>
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-muted">{label}</p>
                <p className="truncate text-sm font-semibold text-foreground">{value}</p>
            </div>
        </div>
    );
}

function ProfileVisibilityCard({ pet }: { pet: Pet }) {
    const t = useTranslations("PetDetail.overview.visibility");
    const isPublic = pet.isPublicProfile;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const publicUrl = `${baseUrl}/public/${pet.petCode}`;

    const handleCopied = () => {
        navigator.clipboard.writeText(publicUrl);
        toast.success(t("copied"));
    };

    const { mutateAsync: togglePublic, isPending } = useTogglePublicPetProfile();

    const handleTogglePublic = async () => {
        try {
            await togglePublic({ id: pet.id });
        } catch (error: any) {
            getMutateError(error);
        }
    };

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <div className="mb-5 flex items-center gap-3">
                <ContactIcon />
                <div>
                    <h3 className="font-semibold text-foreground">{t("title")}</h3>
                    <p className="text-xs text-muted">{t("subtitle", { name: pet.name })}</p>
                </div>
            </div>

            <div
                className={`rounded-xl border p-4 ${isPublic ? "border-success/30 bg-success/5" : "border-separator bg-background-secondary"
                    }`}
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                            <span className="material-symbols-outlined text-success">public</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{t("publicProfile")}</p>
                            <p className="text-xs text-muted">{t("anyoneWithLink")}</p>
                        </div>
                    </div>

                    <Switch isSelected={isPublic} onChange={handleTogglePublic} isDisabled={isPending}>
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </div>
            </div>

            <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleCopied}>
                    <span className="material-symbols-outlined text-[17px]">link</span>
                    {t("copyLink")}
                </Button>

                <Button variant="outline" size="sm" isIconOnly aria-label={t("showQr")}>
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                </Button>
            </div>

            <div className="mt-4 flex items-start gap-2 border-t border-separator pt-4">
                <span className="material-symbols-outlined text-[18px] text-muted">lock</span>
                <p className="text-xs text-muted">{t("privacyNote")}</p>
            </div>
        </Card>
    );
}

function VaccinationCard({ vaccination }: { vaccination: any }) {
    const t = useTranslations("PetDetail.overview.vaccination");

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <div className="flex h-full flex-col">
                <div className="flex items-center gap-3">
                    <Syringe className="text-success" />
                    <div>
                        <p className="text-xs text-muted">{t("label")}</p>
                        <h3 className="font-semibold text-foreground">
                            {vaccination?.vaccineName || t("none")}
                        </h3>
                    </div>
                </div>

                {vaccination && (
                    <div className="mt-5 flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-bold text-foreground">{formatDate(vaccination.nextDueAt)}</p>
                            <p className="mt-1 text-xs text-muted">{t("note")}</p>
                        </div>
                        <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                            {t("upcoming")}
                        </span>
                    </div>
                )}
                <Button variant="outline" size="sm" className="mt-5 self-end">
                    {t("viewAll")}
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Button>
            </div>
        </Card>
    );
}

function WeightGoalCard({ current, target, unit }: { current: number; target: number; unit: string }) {
    const t = useTranslations("PetDetail.overview.weightGoal");
    const percentage = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <div className="flex items-center gap-3">
                <WeightIcon className="text-success" />
                <div>
                    <p className="text-xs text-muted">{t("label")}</p>
                    <h3 className="font-semibold">
                        {target > 0 ? `${current} / ${target} ${unit.toLowerCase()}` : `${current} ${unit.toLowerCase()}`}
                    </h3>
                </div>
            </div>

            {target > 0 && (
                <>
                    <div className="mt-6 flex items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-background-secondary">
                            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-muted">{percentage}%</span>
                    </div>

                    <p className="mt-3 text-xs text-muted">
                        {percentage >= 100 ? t("reached") : t("inProgress")}
                    </p>
                </>
            )}

            <Button variant="outline" size="sm" className="mt-5 self-end">
                {t("update")}
            </Button>
        </Card>
    );
}

function NotesCard({ notes }: { notes: any[] }) {
    const t = useTranslations("PetDetail.overview.notes");
    const latestNote = notes?.[0];

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <div className="flex items-center gap-3">
                <NotebookIcon className="bg-amber-100 text-amber-600" />
                <div>
                    <p className="text-xs text-muted">{t("label")}</p>
                    <h3 className="font-semibold">{latestNote ? latestNote.title : t("none")}</h3>
                </div>
            </div>

            {latestNote ? (
                <p className="mt-5 line-clamp-3 text-sm text-muted">{latestNote.content}</p>
            ) : (
                <p className="mt-5 text-sm text-muted">{t("empty")}</p>
            )}

            <Button variant="outline" size="sm" className="mt-5 self-end">
                <span className="material-symbols-outlined text-[16px]">add</span>
                {t("add")}
            </Button>
        </Card>
    );
}

function PetStatusCard({ pet }: { pet: Pet }) {
    const t = useTranslations("PetDetail.overview.status");

    return (
        <Card variant="default" className="border border-separator p-5 shadow-level-1">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <UserShieldIcon className="text-success" />
                    <div>
                        <h3 className="font-semibold">{t("title")}</h3>
                        <p className="text-xs text-muted">{t("subtitle")}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-3 md:grid-cols-4">
                    <StatusItem icon="verified" label={t("profile")} value={pet.status || "Active"} />
                    <StatusItem
                        icon="memory"
                        label={t("microchip")}
                        value={pet.microchipNumber ? t("registered") : t("notRegistered")}
                    />
                    <StatusItem icon="warning" label={t("lostMode")} value={t("off")} />
                    <StatusItem icon="public" label={t("publicProfile")} value={t("enabled")} />
                </div>
            </div>
        </Card>
    );
}

function StatusItem({ icon, label, value }: { icon: string; label: string; value: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-muted">{icon}</span>
            <div>
                <p className="text-[10px] text-muted">{label}</p>
                <p className="text-xs font-semibold text-foreground">{value}</p>
            </div>
        </div>
    );
}
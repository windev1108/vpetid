"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import {
    AlertDialog,
    Button,
    Card,
    Chip,
    Description,
    FieldError,
    Input,
    Label,
    ListBox,
    Modal,
    Select,
    TextArea,
    TextField,
} from "@heroui/react";
import toast from "react-hot-toast";

import { Pet } from "@/services/pets/types";
import { usePetHealth } from "@/services/health/queries";
import {
    useCreateVaccination,
    useDeleteVaccination,
    useUpdateVaccination,
} from "@/services/health/mutations";
import type {
    CreateVaccinationPayload,
    PetVaccination,
    UpdateVaccinationPayload,
    VaccinationStatus,
} from "@/services/health/types";
import { VaccinationReminderCard } from "./VaccinationReminderCard";

type DisplayVaccinationStatus = VaccinationStatus | "OVERDUE";

type VaccinationFormValues = {
    vaccineName: string;
    status: VaccinationStatus;
    administeredAt: string;
    nextDueAt: string;
    veterinarian: string;
    clinic: string;
    batchNumber: string;
    manufacturer: string;
    notes: string;
};

const EMPTY_FORM: VaccinationFormValues = {
    vaccineName: "",
    status: "SCHEDULED",
    administeredAt: "",
    nextDueAt: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    manufacturer: "",
    notes: "",
};

function isoToDateInput(value: string | null | undefined) {
    if (!value) return "";
    return value.slice(0, 10);
}

function dateInputToIso(value: string) {
    if (!value) return undefined;
    return new Date(`${value}T00:00:00`).toISOString();
}

function formatDate(value: string | null | undefined) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

function getDaysUntil(value: string | null | undefined) {
    if (!value) return null;
    const target = new Date(value);
    if (Number.isNaN(target.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getDisplayStatus(vaccination: PetVaccination): DisplayVaccinationStatus {
    if (vaccination.status === "SCHEDULED" && vaccination.nextDueAt) {
        const days = getDaysUntil(vaccination.nextDueAt);
        if (days !== null && days < 0) return "OVERDUE";
    }
    return vaccination.status;
}

function statusClass(status: DisplayVaccinationStatus) {
    switch (status) {
        case "COMPLETED":
            return "border-success/20 bg-success/10 text-success";
        case "SCHEDULED":
            return "border-warning/20 bg-warning/10 text-warning";
        case "MISSED":
            return "border-danger/20 bg-danger/10 text-danger";
        case "OVERDUE":
            return "border-danger/20 bg-danger/10 text-danger";
        case "CANCELLED":
        default:
            return "border-separator bg-background-secondary text-muted";
    }
}

function getVaccinationForm(vaccination: PetVaccination): VaccinationFormValues {
    return {
        vaccineName: vaccination.vaccineName ?? "",
        status: vaccination.status,
        administeredAt: isoToDateInput(vaccination.administeredAt),
        nextDueAt: isoToDateInput(vaccination.nextDueAt),
        veterinarian: vaccination.veterinarian ?? "",
        clinic: vaccination.clinic ?? "",
        batchNumber: vaccination.batchNumber ?? "",
        manufacturer: vaccination.manufacturer ?? "",
        notes: vaccination.notes ?? "",
    };
}

export function HealthTab({ pet }: { pet: Pet }) {
    const t = useTranslations("PetDetail.health");
    const { data, isLoading, isError, refetch } = usePetHealth(pet.id);
    const { mutateAsync: createVaccination, isPending: isCreating } = useCreateVaccination(pet.id);
    const { mutateAsync: updateVaccination, isPending: isUpdating } = useUpdateVaccination(pet.id);
    const { mutateAsync: deleteVaccination, isPending: isDeleting } = useDeleteVaccination(pet.id);

    const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
    const [editingVaccination, setEditingVaccination] = useState<PetVaccination | null>(null);
    const [form, setForm] = useState<VaccinationFormValues>(EMPTY_FORM);
    const [formError, setFormError] = useState("");
    const [deletingVaccination, setDeletingVaccination] = useState<PetVaccination | null>(null);

    const isSaving = isCreating || isUpdating;

    const upcomingVaccinations = data?.upcoming ?? [];
    const historyVaccinations = data?.history ?? [];
    const summary = data?.summary;
    const reminder = data?.reminder;

    function openCreateModal() {
        setEditingVaccination(null);
        setForm({ ...EMPTY_FORM });
        setFormError("");
        setIsVaccinationModalOpen(true);
    }

    function openEditModal(vaccination: PetVaccination) {
        setEditingVaccination(vaccination);
        setForm(getVaccinationForm(vaccination));
        setFormError("");
        setIsVaccinationModalOpen(true);
    }

    function closeVaccinationModal() {
        if (isSaving) return;
        setIsVaccinationModalOpen(false);
        setEditingVaccination(null);
        setForm({ ...EMPTY_FORM });
        setFormError("");
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const vaccineName = form.vaccineName.trim();

        if (!vaccineName) {
            setFormError(t("modal.vaccineNameRequired"));
            return;
        }
        if (form.status === "SCHEDULED" && !form.nextDueAt) {
            setFormError(t("modal.errors.nextDueRequired"));
            return;
        }
        if (form.status === "COMPLETED" && !form.administeredAt) {
            setFormError(t("modal.errors.administeredRequired"));
            return;
        }

        setFormError("");

        const payload: CreateVaccinationPayload | UpdateVaccinationPayload = {
            vaccineName,
            status: form.status,
            administeredAt: dateInputToIso(form.administeredAt),
            nextDueAt: dateInputToIso(form.nextDueAt),
            veterinarian: form.veterinarian.trim() || undefined,
            clinic: form.clinic.trim() || undefined,
            batchNumber: form.batchNumber.trim() || undefined,
            manufacturer: form.manufacturer.trim() || undefined,
            notes: form.notes.trim() || undefined,
        };

        try {
            if (editingVaccination) {
                await updateVaccination({ vaccinationId: editingVaccination.id, payload });
                toast.success(t("modal.toasts.updated"));
            } else {
                await createVaccination(payload as CreateVaccinationPayload);
                toast.success(t("modal.toasts.created"));
            }
            closeVaccinationModal();
        } catch (error) {
            console.error("Failed to save vaccination:", error);
            setFormError(t("modal.errors.saveFailed"));
        }
    }

    async function handleDelete() {
        if (!deletingVaccination) return;
        try {
            await deleteVaccination(deletingVaccination.id);
            toast.success(t("deleteDialog.toasts.deleted"));
            setDeletingVaccination(null);
        } catch (error) {
            console.error("Failed to delete vaccination:", error);
            toast.error(t("deleteDialog.toasts.failed"));
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-5">
                <div className="flex items-center justify-center rounded-2xl border border-separator bg-surface py-20">
                    <div className="flex items-center gap-3 text-sm text-muted">
                        <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        {t("loading")}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/20 bg-danger/5 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
                    <span className="material-symbols-outlined text-danger">error</span>
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{t("loadError.title")}</h3>
                <p className="mt-1 text-sm text-muted">{t("loadError.subtitle")}</p>
                <Button size="sm" variant="tertiary" className="mt-5" onPress={() => refetch()}>
                    {t("loadError.retry")}
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[22px] text-accent">health_and_safety</span>
                            <h2 className="text-xl font-semibold text-foreground">{t("title")}</h2>
                        </div>
                        <p className="mt-1 text-sm text-muted">{t("subtitle", { name: pet.name })}</p>
                    </div>

                    <Button size="sm" className="gap-2 bg-accent text-white" onPress={openCreateModal}>
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        {t("addVaccination")}
                    </Button>
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <HealthStatCard icon="vaccines" label={t("stats.upToDate")} value={summary?.upToDate ?? 0} suffix={t("stats.suffix")} variant="success" />
                    <HealthStatCard icon="calendar_month" label={t("stats.upcoming")} value={summary?.upcoming ?? 0} suffix={t("stats.suffix")} variant="warning" />
                    <HealthStatCard icon="warning" label={t("stats.overdue")} value={summary?.overdue ?? 0} suffix={t("stats.suffix")} variant="danger" />
                    <HealthStatCard icon="shield" label={t("stats.total")} value={summary?.total ?? 0} suffix={t("stats.suffix")} variant="accent" />
                </div>

                {/* Main content */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                    <div className="space-y-5">
                        {/* Upcoming */}
                        <Card className="border border-separator shadow-level-1">
                            <Card.Content className="p-5">
                                <SectionHeader title={t("upcomingSection.title")} icon="event_upcoming" />

                                {upcomingVaccinations?.length === 0 ? (
                                    <EmptyState icon="event_available" title={t("upcomingSection.emptyTitle")} description={t("upcomingSection.emptyDescription")} />
                                ) : (
                                    <div className="mt-5 overflow-x-auto">
                                        <table className="w-full min-w-[850px]">
                                            <thead>
                                                <tr className="border-b border-separator text-left text-xs font-medium uppercase tracking-wide text-muted">
                                                    <th className="pb-3 pr-4">{t("upcomingSection.columns.vaccine")}</th>
                                                    <th className="pb-3 pr-4">{t("upcomingSection.columns.dueDate")}</th>
                                                    <th className="pb-3 pr-4">{t("upcomingSection.columns.status")}</th>
                                                    <th className="pb-3 pr-4">{t("upcomingSection.columns.schedule")}</th>
                                                    <th className="pb-3 text-right">{t("upcomingSection.columns.actions")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {upcomingVaccinations.map((vaccination) => {
                                                    const status = getDisplayStatus(vaccination);
                                                    const days = getDaysUntil(vaccination.nextDueAt);

                                                    return (
                                                        <tr key={vaccination.id} className="border-b border-separator last:border-0">
                                                            <td className="py-4 pr-4">
                                                                <div className="flex items-center gap-3">
                                                                    <VaccineIcon />
                                                                    <div>
                                                                        <p className="font-semibold text-foreground">{vaccination.vaccineName}</p>
                                                                        <p className="mt-0.5 max-w-[280px] truncate text-xs text-muted">
                                                                            {vaccination.manufacturer || vaccination.clinic || t("upcomingSection.vaccinationRecord")}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="py-4 pr-4">
                                                                <p className="text-sm font-medium text-foreground">{formatDate(vaccination.nextDueAt)}</p>
                                                                {days !== null && (
                                                                    <p className={`mt-0.5 text-xs ${days < 0 ? "text-danger" : days <= 30 ? "text-warning" : "text-muted"}`}>
                                                                        {days < 0
                                                                            ? t("upcomingSection.daysOverdue", { days: Math.abs(days) })
                                                                            : days === 0
                                                                                ? t("upcomingSection.dueToday")
                                                                                : t("upcomingSection.inDays", { days })}
                                                                    </p>
                                                                )}
                                                            </td>

                                                            <td className="py-4 pr-4">
                                                                <StatusChip status={status} />
                                                            </td>

                                                            <td className="py-4 pr-4">
                                                                <div className="flex items-start gap-2">
                                                                    <span className="material-symbols-outlined text-[17px] text-muted">event</span>
                                                                    <div>
                                                                        <p className="text-xs font-medium text-foreground">{t("upcomingSection.nextDose")}</p>
                                                                        <p className="text-xs text-muted">{formatDate(vaccination.nextDueAt)}</p>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="py-4 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button size="sm" variant="tertiary" onPress={() => openEditModal(vaccination)}>
                                                                        {status === "SCHEDULED" ? t("upcomingSection.reschedule") : t("upcomingSection.edit")}
                                                                    </Button>

                                                                    <Button
                                                                        isIconOnly
                                                                        size="sm"
                                                                        variant="tertiary"
                                                                        aria-label={t("upcomingSection.delete", { name: vaccination.vaccineName })}
                                                                        onPress={() => setDeletingVaccination(vaccination)}
                                                                    >
                                                                        <span className="material-symbols-outlined text-[18px] text-danger">delete</span>
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card.Content>
                        </Card>

                        {/* History */}
                        <Card className="border border-separator shadow-level-1">
                            <Card.Content className="p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <SectionHeader title={t("historySection.title")} icon="history" />
                                    {historyVaccinations.length > 0 && (
                                        <span className="text-xs text-muted">
                                            {t("historySection.records", { count: historyVaccinations.length })}
                                        </span>
                                    )}
                                </div>

                                {historyVaccinations.length === 0 ? (
                                    <EmptyState icon="vaccines" title={t("historySection.emptyTitle")} description={t("historySection.emptyDescription")} />
                                ) : (
                                    <div className="mt-5 overflow-x-auto">
                                        <table className="w-full min-w-[950px]">
                                            <thead>
                                                <tr className="border-b border-separator text-left text-xs font-medium uppercase tracking-wide text-muted">
                                                    <th className="pb-3 pr-4">{t("historySection.columns.vaccine")}</th>
                                                    <th className="pb-3 pr-4">{t("historySection.columns.dateGiven")}</th>
                                                    <th className="pb-3 pr-4">{t("historySection.columns.nextDue")}</th>
                                                    <th className="pb-3 pr-4">{t("historySection.columns.status")}</th>
                                                    <th className="pb-3 pr-4">{t("historySection.columns.vet")}</th>
                                                    <th className="pb-3 pr-4">{t("historySection.columns.notes")}</th>
                                                    <th className="pb-3 text-right">{t("historySection.columns.actions")}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {historyVaccinations.map((vaccination) => (
                                                    <tr key={vaccination.id} className="border-b border-separator last:border-0">
                                                        <td className="py-4 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
                                                                    <span className="material-symbols-outlined text-[17px] text-success">check_circle</span>
                                                                </div>
                                                                <div>
                                                                    <p className="font-semibold text-foreground">{vaccination.vaccineName}</p>
                                                                    <p className="text-xs text-muted">
                                                                        {vaccination.manufacturer || t("upcomingSection.vaccinationRecord")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-4 pr-4 text-sm text-foreground">{formatDate(vaccination.administeredAt)}</td>
                                                        <td className="py-4 pr-4 text-sm text-foreground">{formatDate(vaccination.nextDueAt)}</td>

                                                        <td className="py-4 pr-4">
                                                            <StatusChip status={getDisplayStatus(vaccination)} />
                                                        </td>

                                                        <td className="py-4 pr-4">
                                                            <p className="text-sm font-medium text-foreground">{vaccination.veterinarian || "—"}</p>
                                                            <p className="text-xs text-muted">{vaccination.clinic || "—"}</p>
                                                        </td>

                                                        <td className="max-w-[220px] py-4 pr-4">
                                                            <p className="truncate text-xs text-muted">{vaccination.notes || "—"}</p>
                                                        </td>

                                                        <td className="py-4 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="tertiary"
                                                                    aria-label={t("upcomingSection.edit") + " " + vaccination.vaccineName}
                                                                    onPress={() => openEditModal(vaccination)}
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </Button>

                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="tertiary"
                                                                    aria-label={t("upcomingSection.delete", { name: vaccination.vaccineName })}
                                                                    onPress={() => setDeletingVaccination(vaccination)}
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px] text-danger">delete</span>
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card.Content>
                        </Card>
                    </div>

                    <VaccinationReminderCard petId={pet.id} reminder={reminder!} />
                </div>
            </div>

            {/* Add / Edit Vaccination Modal */}
            <Modal>
                <Modal.Backdrop isOpen={isVaccinationModalOpen} onOpenChange={setIsVaccinationModalOpen} variant="blur">
                    <Modal.Container size="lg" scroll="inside">
                        <Modal.Dialog>
                            <Modal.CloseTrigger />

                            <Modal.Header>
                                <Modal.Icon>
                                    <span className="material-symbols-outlined text-[20px]">vaccines</span>
                                </Modal.Icon>

                                <div>
                                    <Modal.Heading>
                                        {editingVaccination ? t("modal.editTitle") : t("modal.addTitle")}
                                    </Modal.Heading>
                                    <p className="mt-1 text-sm font-normal text-muted">
                                        {editingVaccination
                                            ? t("modal.editSubtitle")
                                            : t("modal.addSubtitle", { name: pet.name })}
                                    </p>
                                </div>
                            </Modal.Header>

                            <form onSubmit={handleSubmit}>
                                <Modal.Body className="space-y-5">
                                    {formError && (
                                        <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                                            <div className="flex items-start gap-2">
                                                <span className="material-symbols-outlined text-[18px]">error</span>
                                                <span>{formError}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <TextField
                                            className="sm:col-span-2"
                                            isRequired
                                            isInvalid={Boolean(formError && !form.vaccineName.trim())}
                                        >
                                            <Label>{t("modal.vaccineName")}</Label>
                                            <Input
                                                value={form.vaccineName}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, vaccineName: event.target.value }))
                                                }
                                                placeholder={t("modal.vaccineNamePlaceholder")}
                                                variant="secondary"
                                            />
                                            <Description>{t("modal.vaccineNameDescription")}</Description>
                                            {!form.vaccineName.trim() && formError && (
                                                <FieldError>{t("modal.vaccineNameRequired")}</FieldError>
                                            )}
                                        </TextField>

                                        <Select
                                            value={form.status}
                                            onChange={(value) =>
                                                setForm((current) => ({
                                                    ...current,
                                                    status: String(value ?? "SCHEDULED") as VaccinationStatus,
                                                }))
                                            }
                                            variant="secondary"
                                        >
                                            <Label>{t("modal.status")}</Label>
                                            <Select.Trigger>
                                                <Select.Value />
                                                <Select.Indicator />
                                            </Select.Trigger>

                                            <Select.Popover>
                                                <ListBox>
                                                    <ListBox.Item id="SCHEDULED">
                                                        <Label>{t("modal.statusScheduled")}</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                    <ListBox.Item id="COMPLETED">
                                                        <Label>{t("modal.statusCompleted")}</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                    <ListBox.Item id="MISSED">
                                                        <Label>{t("modal.statusMissed")}</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                    <ListBox.Item id="CANCELLED">
                                                        <Label>{t("modal.statusCancelled")}</Label>
                                                        <ListBox.ItemIndicator />
                                                    </ListBox.Item>
                                                </ListBox>
                                            </Select.Popover>
                                        </Select>

                                        <TextField>
                                            <Label>{t("modal.dateGiven")}</Label>
                                            <Input
                                                type="date"
                                                value={form.administeredAt}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, administeredAt: event.target.value }))
                                                }
                                                variant="secondary"
                                            />
                                        </TextField>

                                        <TextField>
                                            <Label>{t("modal.nextDueDate")}</Label>
                                            <Input
                                                type="date"
                                                value={form.nextDueAt}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, nextDueAt: event.target.value }))
                                                }
                                                variant="secondary"
                                            />
                                        </TextField>

                                        <TextField>
                                            <Label>{t("modal.veterinarian")}</Label>
                                            <Input
                                                value={form.veterinarian}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, veterinarian: event.target.value }))
                                                }
                                                placeholder={t("modal.veterinarianPlaceholder")}
                                                variant="secondary"
                                            />
                                        </TextField>

                                        <TextField>
                                            <Label>{t("modal.clinic")}</Label>
                                            <Input
                                                value={form.clinic}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, clinic: event.target.value }))
                                                }
                                                placeholder={t("modal.clinicPlaceholder")}
                                                variant="secondary"
                                            />
                                        </TextField>

                                        <TextField>
                                            <Label>{t("modal.batchNumber")}</Label>
                                            <Input
                                                value={form.batchNumber}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, batchNumber: event.target.value }))
                                                }
                                                placeholder={t("modal.optional")}
                                                variant="secondary"
                                            />
                                        </TextField>

                                        <TextField>
                                            <Label>{t("modal.manufacturer")}</Label>
                                            <Input
                                                value={form.manufacturer}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, manufacturer: event.target.value }))
                                                }
                                                placeholder={t("modal.optional")}
                                                variant="secondary"
                                            />
                                        </TextField>

                                        <TextField className="sm:col-span-2">
                                            <Label>{t("modal.notes")}</Label>
                                            <TextArea
                                                value={form.notes}
                                                onChange={(event) =>
                                                    setForm((current) => ({ ...current, notes: event.target.value }))
                                                }
                                                placeholder={t("modal.notesPlaceholder")}
                                                rows={4}
                                                maxLength={1000}
                                                variant="secondary"
                                            />
                                        </TextField>
                                    </div>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button type="button" variant="tertiary" isDisabled={isSaving} onPress={closeVaccinationModal}>
                                        {t("modal.cancel")}
                                    </Button>

                                    <Button type="submit" className="bg-accent text-white" isDisabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                                {t("modal.saving")}
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">check</span>
                                                {editingVaccination ? t("modal.saveChanges") : t("modal.add")}
                                            </>
                                        )}
                                    </Button>
                                </Modal.Footer>
                            </form>
                        </Modal.Dialog>
                    </Modal.Container>
                </Modal.Backdrop>
            </Modal>

            {/* Delete confirmation */}
            <AlertDialog>
                <AlertDialog.Backdrop
                    isOpen={Boolean(deletingVaccination)}
                    onOpenChange={(isOpen) => {
                        if (!isOpen && !isDeleting) setDeletingVaccination(null);
                    }}
                    variant="blur"
                >
                    <AlertDialog.Container size="sm">
                        <AlertDialog.Dialog>
                            <AlertDialog.CloseTrigger />

                            <AlertDialog.Header>
                                <AlertDialog.Icon status="danger">
                                    <span className="material-symbols-outlined">delete</span>
                                </AlertDialog.Icon>
                                <AlertDialog.Heading>{t("deleteDialog.title")}</AlertDialog.Heading>
                            </AlertDialog.Header>

                            <AlertDialog.Body>
                                <p className="text-sm text-muted">
                                    {t("deleteDialog.description", {
                                        vaccine: deletingVaccination?.vaccineName ?? "",
                                        name: pet.name,
                                    })}
                                </p>
                                <p className="mt-2 text-xs text-danger">{t("deleteDialog.warning")}</p>
                            </AlertDialog.Body>

                            <AlertDialog.Footer>
                                <Button variant="tertiary" isDisabled={isDeleting} onPress={() => setDeletingVaccination(null)}>
                                    {t("deleteDialog.cancel")}
                                </Button>

                                <Button className="bg-danger text-white" isDisabled={isDeleting} onPress={handleDelete}>
                                    {isDeleting ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                            {t("deleteDialog.deleting")}
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                            {t("deleteDialog.delete")}
                                        </>
                                    )}
                                </Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </>
    );
}

/* Small components */

function HealthStatCard({
    icon,
    label,
    value,
    suffix,
    variant,
}: {
    icon: string;
    label: string;
    value: number;
    suffix: string;
    variant: "success" | "warning" | "danger" | "accent";
}) {
    const styles = {
        success: { wrapper: "border-success/15 bg-success/[0.04]", icon: "bg-success/10 text-success" },
        warning: { wrapper: "border-warning/15 bg-warning/[0.04]", icon: "bg-warning/10 text-warning" },
        danger: { wrapper: "border-danger/15 bg-danger/[0.04]", icon: "bg-danger/10 text-danger" },
        accent: { wrapper: "border-accent/15 bg-accent/[0.04]", icon: "bg-accent/10 text-accent" },
    };
    const style = styles[variant];

    return (
        <Card className={`border shadow-none ${style.wrapper}`}>
            <Card.Content className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.icon}`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <div className="min-w-0 text-center">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="mt-0.5 text-xl font-bold text-foreground">{value}</p>
                </div>
            </Card.Content>
        </Card>
    );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[19px] text-muted">{icon}</span>
            <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
    );
}

function VaccineIcon() {
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <span className="material-symbols-outlined text-[18px] text-accent">vaccines</span>
        </div>
    );
}

function StatusChip({ status }: { status: DisplayVaccinationStatus }) {
    const t = useTranslations("PetDetail.health.status");
    return (
        <Chip size="sm" variant="soft" className={statusClass(status)}>
            <Chip.Label>{t(status)}</Chip.Label>
        </Chip>
    );
}

function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background-secondary">
                <span className="material-symbols-outlined text-[24px] text-muted">{icon}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
    );
}
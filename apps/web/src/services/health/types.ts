export const VACCINATION_STATUSES = [
    "SCHEDULED",
    "COMPLETED",
    "MISSED",
    "CANCELLED",
] as const;

export type VaccinationStatus =
    (typeof VACCINATION_STATUSES)[number];

export type VaccinationDisplayStatus =
    | VaccinationStatus
    | "OVERDUE";

export const REMINDER_CHANNELS = [
    "IN_APP",
    "PUSH",
    "EMAIL",
    "SMS",
] as const;

export type ReminderChannel =
    (typeof REMINDER_CHANNELS)[number];

export type PetVaccination = {
    id: string;
    petId: string;

    vaccineName: string;

    status: VaccinationStatus;

    displayStatus?:
        | VaccinationDisplayStatus;

    administeredAt: string | null;
    nextDueAt: string | null;

    veterinarian: string | null;
    clinic: string | null;

    batchNumber: string | null;
    manufacturer: string | null;

    notes: string | null;

    createdAt?: string;
    updatedAt?: string;
};

export type HealthSummary = {
    upToDate: number;
    upcoming: number;
    overdue: number;
    total: number;
};

export type HealthReminderConfig = {
    id: string;
    petId: string;

    enabled: boolean;

    remindBeforeDays: number;

    channels: ReminderChannel[];

    timezone: string;

    createdAt: string;
    updatedAt: string;
};

export type PetHealthOverview = {
    summary: HealthSummary;

    upcoming: PetVaccination[];

    history: PetVaccination[];

    reminder: HealthReminderConfig;
};

export type CreateVaccinationPayload = {
    vaccineName: string;

    status?: VaccinationStatus;

    administeredAt?: string;

    nextDueAt?: string;

    veterinarian?: string;

    clinic?: string;

    batchNumber?: string;

    manufacturer?: string;

    notes?: string;
};

export type UpdateVaccinationPayload = {
    vaccineName?: string;

    status?: VaccinationStatus;

    administeredAt?: string | null;

    nextDueAt?: string | null;

    veterinarian?: string;

    clinic?: string;

    batchNumber?: string;

    manufacturer?: string;

    notes?: string;
};

export type UpdateHealthReminderPayload = {
    enabled?: boolean;

    remindBeforeDays?: number;

    channels?: ReminderChannel[];

    timezone?: string;
};
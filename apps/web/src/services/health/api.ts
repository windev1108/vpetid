
import { apiRequest } from "../client";
import {
    CreateVaccinationPayload,
    PetHealthOverview,
    PetVaccination,
    UpdateHealthReminderPayload,
    UpdateVaccinationPayload,
    HealthReminderConfig,
} from "./types";

const healthPath = (
    petId: string,
) =>
    `/pets/${petId}/health`;

export const healthApi = {
    // ------------------------------------------------------------
    // Overview
    // ------------------------------------------------------------

    getOverview(
        petId: string,
    ) {
        return apiRequest<PetHealthOverview>(
            healthPath(petId),
        );
    },

    // ------------------------------------------------------------
    // Reminder
    // ------------------------------------------------------------

    getReminder(
        petId: string,
    ) {
        return apiRequest<HealthReminderConfig>(
            `${healthPath(
                petId,
            )}/reminder`,
        );
    },

    updateReminder(
        petId: string,
        payload: UpdateHealthReminderPayload,
    ) {
        return apiRequest<HealthReminderConfig>(
            `${healthPath(
                petId,
            )}/reminder`,
            {
                method: "PATCH",
                body: payload,
            },
        );
    },

    // ------------------------------------------------------------
    // Vaccination
    // ------------------------------------------------------------

    createVaccination(
        petId: string,
        payload: CreateVaccinationPayload,
    ) {
        return apiRequest<PetVaccination>(
            `${healthPath(
                petId,
            )}/vaccinations`,
            {
                method: "POST",
                body: payload,
            },
        );
    },

    updateVaccination(
        petId: string,
        vaccinationId: string,
        payload: UpdateVaccinationPayload,
    ) {
        return apiRequest<PetVaccination>(
            `${healthPath(
                petId,
            )}/vaccinations/${vaccinationId}`,
            {
                method: "PATCH",
                body: payload,
            },
        );
    },

    deleteVaccination(
        petId: string,
        vaccinationId: string,
    ) {
        return apiRequest<{
            success: boolean;
            message: string;
        }>(
            `${healthPath(
                petId,
            )}/vaccinations/${vaccinationId}`,
            {
                method: "DELETE",
            },
        );
    },
};
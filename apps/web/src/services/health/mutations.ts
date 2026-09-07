"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import { healthApi } from "./api";

import {
    CreateVaccinationPayload,
    UpdateHealthReminderPayload,
    UpdateVaccinationPayload,
} from "./types";

import {
    healthQueryKeys,
} from "./queries";

export function useCreateVaccination(
    petId: string,
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            payload: CreateVaccinationPayload,
        ) =>
            healthApi.createVaccination(
                petId,
                payload,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    healthQueryKeys.overview(
                        petId,
                    ),
            });

            toast.success(
                "Vaccination added successfully.",
            );
        },

        onError: () => {
            toast.error(
                "Failed to add vaccination.",
            );
        },
    });
}

export function useUpdateVaccination(
    petId: string,
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: ({
            vaccinationId,
            payload,
        }: {
            vaccinationId: string;
            payload: UpdateVaccinationPayload;
        }) =>
            healthApi.updateVaccination(
                petId,
                vaccinationId,
                payload,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    healthQueryKeys.overview(
                        petId,
                    ),
            });

            toast.success(
                "Vaccination updated successfully.",
            );
        },

        onError: () => {
            toast.error(
                "Failed to update vaccination.",
            );
        },
    });
}

export function useDeleteVaccination(
    petId: string,
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            vaccinationId: string,
        ) =>
            healthApi.deleteVaccination(
                petId,
                vaccinationId,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    healthQueryKeys.overview(
                        petId,
                    ),
            });

            toast.success(
                "Vaccination deleted successfully.",
            );
        },

        onError: () => {
            toast.error(
                "Failed to delete vaccination.",
            );
        },
    });
}

export function useUpdateHealthReminder(
    petId: string,
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            payload: UpdateHealthReminderPayload,
        ) =>
            healthApi.updateReminder(
                petId,
                payload,
            ),

        onSuccess: (
            reminder,
        ) => {
            // Update overview cache
            queryClient.setQueryData(
                healthQueryKeys.overview(
                    petId,
                ),
                (
                    current:
                        | ReturnType<
                              typeof Object
                          >
                        | undefined,
                ) => {
                    if (!current) {
                        return current;
                    }

                    return {
                        ...current,
                        reminder,
                    };
                },
            );

            // Update standalone reminder cache
            queryClient.setQueryData(
                healthQueryKeys.reminder(
                    petId,
                ),
                reminder,
            );
        },

        onError: () => {
            toast.error(
                "Failed to update reminder settings.",
            );
        },
    });
}
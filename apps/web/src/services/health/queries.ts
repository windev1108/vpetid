"use client";

import {
    useQuery,
} from "@tanstack/react-query";

import { healthApi } from "./api";

export const healthQueryKeys = {
    all: ["health"] as const,

    overview: (
        petId: string,
    ) =>
        [
            ...healthQueryKeys.all,
            "overview",
            petId,
        ] as const,

    reminder: (
        petId: string,
    ) =>
        [
            ...healthQueryKeys.all,
            "reminder",
            petId,
        ] as const,
};

export function usePetHealth(
    petId: string,
) {
    return useQuery({
        queryKey:
            healthQueryKeys.overview(
                petId,
            ),

        queryFn: () =>
            healthApi.getOverview(
                petId,
            ),

        enabled: Boolean(
            petId,
        ),

        staleTime:
            30 * 1000,
    });
}

export function useHealthReminder(
    petId: string,
) {
    return useQuery({
        queryKey:
            healthQueryKeys.reminder(
                petId,
            ),

        queryFn: () =>
            healthApi.getReminder(
                petId,
            ),

        enabled: Boolean(
            petId,
        ),

        staleTime:
            5 * 60 * 1000,
    });
}
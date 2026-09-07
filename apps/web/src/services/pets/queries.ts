"use client";

import { useQuery } from "@tanstack/react-query";
import { petApi } from "./api";


export const petKeys = {
    all: ["pet-overview"] as const,

    detail: (petCode: string) =>
        [...petKeys.all, petCode] as const,
};

export function usePetOverview(
    petCode: string,
) {
    return useQuery({
        queryKey:
            petKeys.detail(petCode),

        queryFn: () =>
            petApi.getOverview(petCode),

        enabled: Boolean(petCode),
    });
}

export function usePets() {
    return useQuery({
        queryKey: ["pets"],
        queryFn: petApi.getMine,
    });
}


export function usePet(
    petCode: string,
) {
    return useQuery({
        queryKey: ["pets", petCode],
        queryFn: () =>
            petApi.getByCode(petCode),
        enabled: Boolean(petCode),
    });
}

export function usePublicPet(
    petCode: string,
) {
    return useQuery({
        queryKey: ["public/pets", petCode],
        queryFn: () =>
            petApi.getPublicByCode(petCode),
        enabled: Boolean(petCode),
        retry: false
    });
}
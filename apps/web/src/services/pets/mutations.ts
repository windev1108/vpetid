"use client";

import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { CreatePetNotePayload, CreatePetPayload, ShareLocationPayload, UpdatePetPayload } from "./types";
import { petApi } from "./api";
import { petKeys } from "./queries";



export function useCreatePet() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            payload: CreatePetPayload,
        ) => petApi.create(payload),

        onSuccess: (pet) => {
            queryClient.invalidateQueries({
                queryKey: ["pets"],
            });

            queryClient.setQueryData(
                ["pets", pet.id],
                pet,
            );
        },
    });
}

export function useUpdatePet() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            payload: UpdatePetPayload,
        ) => petApi.update(payload),

        onSuccess: (pet) => {
            queryClient.invalidateQueries({
                queryKey: ["pets"],
            });

            queryClient.setQueryData(
                ["pets", pet.id],
                pet,
            );
        },
    });
}


export function useTogglePublicPetProfile() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            payload: { id: string },
        ) => petApi.togglePublicProfile(payload),

        onSuccess: (pet) => {
            queryClient.invalidateQueries({
                queryKey: ["pets"],
            });

            queryClient.setQueryData(
                ["pets", pet.id],
                pet,
            );
        },
    });
}

export function useDeletePet() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            petId: string,
        ) => petApi.remove(petId),

        onSuccess: (pet) => {
            queryClient.invalidateQueries({
                queryKey: ["pets"],
            });

            queryClient.setQueryData(
                ["pets"],
                pet,
            );
        },
    });
}

export function useShareLocation() {
    return useMutation({
        mutationFn: (
            payload: ShareLocationPayload,
        ) => petApi.shareLocation(payload),
    });
}

export function useUploadPetAvatar() {
    return useMutation({
        mutationFn: (file: File) => petApi.uploadPetAvatar(file),
    });
}

export function useCreatePetNote(
    petCode: string,
) {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            payload: CreatePetNotePayload,
        ) =>
            petApi.createNote(
                petCode,
                payload,
            ),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:
                    petKeys.detail(
                        petCode,
                    ),
            });
        },
    });
}
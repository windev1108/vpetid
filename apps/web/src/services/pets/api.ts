
import { apiRequest } from "../client";
import { CreatePetNotePayload, CreatePetPayload, Pet, PetOverview, ShareLocationPayload, UpdatePetPayload } from "./types";

export const petApi = {
    async getOverview(petCode: string) {
        return apiRequest<PetOverview>(
            `/pets/${petCode}/overview`
        )
    },
    async createNote(petCode: string, payload: CreatePetNotePayload) {
        return apiRequest(
            `/pets/${petCode}/notes`,
            {
                method: "POST",
                body: payload,
            },
        )
    },
    async create(
        payload: CreatePetPayload,
    ): Promise<Pet> {
        return apiRequest<Pet>("/pets", {
            method: "POST",
            body: payload,
        });
    },

    async getMine(): Promise<Pet[]> {
        return await apiRequest<Pet[]>(
            "/pets",
        );
    },

    async uploadPetAvatar(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append("file", file);

        return apiRequest<{ url: string }>("/pets/upload-avatar", {
            method: "POST",
            body: formData, // apiRequest cần tự bỏ qua Content-Type: application/json khi body là FormData
        });
    },

    async getByCode(
        petCode: string,
    ): Promise<Pet> {
        return await apiRequest<Pet>(
            `/pets/${petCode}`,
        );
    },

    async getPublicByCode(
        petCode: string,
    ): Promise<Pet> {
        return await apiRequest<Pet>(
            `/public/pets/${petCode}`,
        );
    },

    async update(
        payload: UpdatePetPayload,
    ): Promise<Pet> {
        const { id, ...rest } = payload
        return await apiRequest<Pet>(
            `/pets/${id}`,
            {
                method: "PATCH",
                body: rest,
            },
        );

    },
    async togglePublicProfile(
        payload: { id: string },
    ): Promise<Pet> {
        const { id } = payload
        return await apiRequest<Pet>(
            `/pets/${id}/public-profile`,
            {
                method: "POST",
            },
        );

    },
    async shareLocation(
        payload: ShareLocationPayload,
    ): Promise<{ success: true }> {
        const { petCode, ...rest } = payload
        return await apiRequest<{ success: true }>(
            `/public/${petCode}/share-location`,
            {
                method: "POST",
                body: rest,
            },
        );

    },

    async remove(
        petId: string,
    ): Promise<void> {
        await apiRequest(
            `/pets/${petId}`,
            {
                method: "DELETE",
            },
        );
    },
};
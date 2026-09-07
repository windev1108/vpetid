import { Profile } from "../auth/types";

export type PetGender =
    | "MALE"
    | "FEMALE"
    | "UNKNOWN";

export type PetStatus =
    | "ACTIVE"
    | "LOST"
    | "DECEASED";

export interface PetMembership {
    id: string;
    role:
    | "OWNER"
    | "CO_OWNER"
    | "FAMILY"
    | "CARETAKER"
    | "VIEWER";
    status: "ACTIVE" | "INVITED" | "REMOVED";
    user: Profile
}

export type WeightUnit = 'KG' | 'LBS'

export interface Pet {
    id: string;
    petCode: string;
    name: string;
    weight: number | null
    weightGoal: number | null
    weightUnit: WeightUnit
    color: string | null
    microchipNumber: number | null
    existingTagId: string | null
    species: string | null;
    breed: string | null;
    gender: PetGender | null;
    dateOfBirth: string | null;
    avatarUrl: string | null;
    coverUrl: string | null;
    description: string | null;
    status: PetStatus;
    createdAt: string;
    updatedAt: string;
    memberships?: PetMembership[];
    superOwner: PetMembership
    isPublicProfile: boolean;
}

export interface CreatePetPayload {
    name: string;
    color?: string;
    weight?: number
    weightUnit?: string;
    microchipNumber?: number
    existingTagId?: string;
    species?: string;
    breed?: string;
    gender?: PetGender;
    birthDate?: string;
    avatarUrl?: string;
    description?: string;
}

export interface UpdatePetPayload extends Partial<CreatePetPayload> {
    id: string
}

export interface CreatePetResponse {
    data: Pet;
}

export interface ShareLocationPayload {
    petCode: string
    longitude: number
    latitude: number
    message?: string
    finderName?: string
    finderPhone?: string
}


export type PetOverviewNote = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type PetOverviewVaccination = {
    id: string;
    vaccineName: string;
    nextDueAt: string | null;
    status: string;
};

export type PetOverview = {
    weightGoal: number | null;
    nextVaccination: PetOverviewVaccination | null;
    notes: PetOverviewNote[];
};

export type CreatePetNotePayload = {
    title: string;
    content: string;
};
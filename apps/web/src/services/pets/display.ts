import type { Pet, PetGender, PetStatus } from "./types";

const genderLabels: Record<PetGender, string> = {
    MALE: "Male",
    FEMALE: "Female",
    UNKNOWN: "Unknown gender",
};

export function getGenderLabel(gender: Pet["gender"]): string | null {
    return gender ? genderLabels[gender] : null;
}

export function getAgeLabel(birthDate: Pet["birthDate"]): string | null {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) return null;

    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();

    if (now.getDate() < birth.getDate()) months -= 1;
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (years <= 0) {
        return months <= 1 ? "< 1 month" : `${months} months`;
    }
    return years === 1 ? "1 year" : `${years} years`;
}


export function getPetSubtitle(pet: Pet): string {
    const parts = [pet.breed ?? pet.species, getGenderLabel(pet.gender), getAgeLabel(pet.dateOfBirth)].filter(
        (part): part is string => Boolean(part),
    );
    return parts.length > 0 ? parts.join(" • ") : "No details added yet";
}
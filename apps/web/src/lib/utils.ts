import { ApiError } from '@/services/client'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
export const formatDate = (date: string) => {
    return dayjs(date).format('DD-MM-YYYY')
}

export const getMutateError = (error: ApiError) => {
    if (error)
        toast.error(error?.message ?? error.message[0] ?? error?.cause)
}

// src/services/pets/display.ts

export interface PetAge {
    years: number;
    months: number;
    days: number;
}

export function calculatePetAge(
    birthdate?: string | Date | null
): PetAge | null {
    if (!birthdate) return null;

    const birth = new Date(birthdate);
    const today = new Date();

    if (Number.isNaN(birth.getTime())) return null;
    if (birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    // Tính lại days chính xác
    const lastMonthDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        birth.getDate()
    );

    days = Math.floor(
        (today.getTime() - lastMonthDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (days < 0) {
        const previousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        );

        days = Math.floor(
            (today.getTime() - previousMonth.getTime()) /
            (1000 * 60 * 60 * 24)
        );
    }

    return {
        years,
        months,
        days,
    };
}

export function getPetAge(birthDate: Date) {
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();

    if (
        months < 0 ||
        (
            months === 0 &&
            now.getDate() < birthDate.getDate()
        )
    ) {
        years--;
        months += 12;
    }

    if (years > 0) {
        return `${years} ${years === 1 ? "year" : "years"} old`;
    }

    if (months > 0) {
        return `${months} ${months === 1 ? "month" : "months"} old`;
    }

    return "Less than 1 month old";
}
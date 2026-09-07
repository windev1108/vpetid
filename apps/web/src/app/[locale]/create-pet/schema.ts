// app/create-pet/schema.ts
import { z } from "zod";

export const petFormSchema = z.object({
    name: z.string().trim().min(1, "Pet name is required"),
    species: z.string().min(1, "Please select a species"),
    breed: z.string().trim().optional(),
    gender: z.enum(["male", "female", "unknown"]).optional(),
    birthdate: z.string().optional(),
    color: z.string().trim().optional(),
    weightUnit: z.enum(['KG','LBS']).optional(),
    weight: z
        .string()
        .optional()
        .refine((v) => !v || Number(v) > 0, "Weight must be a positive number"),
    microchip: z.string().optional().refine((v) => !v || Number(v) > 0, "Microchip must be a positive number"),
    tagId: z.string().trim().optional(),
});

export type PetFormValues = z.infer<typeof petFormSchema>;

export const PET_FORM_DEFAULTS: PetFormValues = {
    name: "",
    species: "",
    breed: "",
    gender: undefined,
    birthdate: "",
    color: "",
    weight: "",
    microchip: "",
    weightUnit: 'KG',
    tagId: "",
};
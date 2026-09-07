import { z } from "zod";

export const profileFormSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "firstNameRequired"),

    lastName: z
        .string()
        .trim()
        .min(1, "lastNameRequired"),

    phoneNumber: z
        .string()
        .trim()
        .min(1, "phoneRequired"),

    email: z
        .string()
        .trim()
        .email("emailInvalid"),

    zaloNumber: z
        .string()
        .trim()
        .optional(),

    whatAppsNumber: z
        .string()
        .trim()
        .optional(),
});

export type ProfileFormValues = z.infer<
    typeof profileFormSchema
>;

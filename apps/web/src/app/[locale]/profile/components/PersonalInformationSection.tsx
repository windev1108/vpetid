"use client";

import {
    UseFormRegister,
    FieldErrors,
} from "react-hook-form";
import {
    PersonIcon,
    CheckCircledIcon,
    LockClosedIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { ProfileFormValues } from "../schema";
import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import { Input } from "@heroui/react";

const inputClass =
    "w-full rounded-lg border border-separator bg-surface px-4 py-2.5 font-body-md text-foreground outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/40";

const errorInputClass =
    "border-danger focus:border-danger focus:ring-danger/30";

const labelClass =
    "mb-2 block font-label-md text-label-md text-muted";

const errorTextClass =
    "mt-1.5 font-label-sm text-label-sm text-danger";

type PersonalInformationSectionProps = {
    register: UseFormRegister<ProfileFormValues>;
    errors: FieldErrors<ProfileFormValues>;
    isPhoneVerified: boolean;
    isEmailVerifiedViaGoogle: boolean;
};

export function PersonalInformationSection({
    register,
    errors,
    isPhoneVerified,
    isEmailVerifiedViaGoogle,
}: PersonalInformationSectionProps) {
    const t = useTranslations("Profile.personalInformation");
    const validationT = useTranslations("Profile.validation");

    return (
        <section className="rounded-xl border border-separator bg-surface p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] md:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-accent-soft-hover)]">
                    <PersonIcon className="h-5 w-5 text-[color:var(--color-accent-soft-foreground)]" />
                </div>

                <div>
                    <h2 className="font-headline-md text-headline-md text-foreground">
                        {t("title")}
                    </h2>

                    <p className="font-label-sm text-label-sm text-muted">
                        {t("subtitle")}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                <div>
                    <label
                        htmlFor="firstName"
                        className={labelClass}
                    >
                        {t("firstName")}
                    </label>

                    <Input
                        id="firstName"
                        type="text"
                        className={`${inputClass} ${errors.firstName
                            ? errorInputClass
                            : ""
                            }`}
                        {...register("firstName")}
                    />

                    {errors.firstName && (
                        <p className={errorTextClass}>
                            {validationT("firstNameRequired")}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="lastName"
                        className={labelClass}
                    >
                        {t("lastName")}
                    </label>

                    <Input
                        id="lastName"
                        type="text"
                        className={`${inputClass} ${errors.lastName
                            ? errorInputClass
                            : ""
                            }`}
                        {...register("lastName")}
                    />

                    {errors.lastName && (
                        <p className={errorTextClass}>
                            {validationT("lastNameRequired")}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phoneNumber"
                        className={labelClass}
                    >
                        {t("phoneNumber")}
                    </label>

                    <div className="relative">
                        <Input
                            id="phoneNumber"
                            type="tel"
                            className={`${inputClass} pr-24 ${errors.phoneNumber
                                ? errorInputClass
                                : ""
                                }`}
                            {...register("phoneNumber")}
                        />

                        {isPhoneVerified && (
                            <span className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-[color:var(--color-success-soft-hover)] px-2.5 py-1 font-label-sm text-label-sm font-semibold text-[color:var(--color-success-soft-foreground)]">
                                <CheckCircledIcon className="h-3.5 w-3.5" />
                                {t("verified")}
                            </span>
                        )}
                    </div>

                    {errors.phoneNumber && (
                        <p className={errorTextClass}>
                            {validationT("phoneRequired")}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className={labelClass}
                    >
                        {t("emailAddress")}
                    </label>

                    <div className="relative">
                        <Input
                            id="email"
                            type="email"
                            readOnly={isEmailVerifiedViaGoogle}
                            className={`${inputClass} pr-10 ${isEmailVerifiedViaGoogle
                                ? "cursor-not-allowed bg-background-secondary text-muted"
                                : ""
                                } ${errors.email
                                    ? errorInputClass
                                    : ""
                                }`}
                            {...register("email")}
                        />

                        {isEmailVerifiedViaGoogle && (
                            <LockClosedIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                        )}
                    </div>

                    {errors.email && (
                        <p className={errorTextClass}>
                            {validationT("emailInvalid")}
                        </p>
                    )}

                    {isEmailVerifiedViaGoogle && (
                        <p className="mt-1.5 flex items-center gap-1.5 font-label-sm text-label-sm text-muted">
                            <GoogleIcon />
                            {t("emailVerifiedViaGoogle")}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
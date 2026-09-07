"use client";

import { UseFormRegister } from "react-hook-form";
import {
    Share1Icon,
    InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import { ProfileFormValues } from "../schema";

const inputClass =
    "w-full rounded-lg border border-separator bg-surface py-2.5 pl-11 pr-3 font-body-md text-foreground outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent/40";

const labelClass =
    "mb-2 block font-label-md text-label-md text-muted";

function FieldIcon({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <span className="absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center">
            {children}
        </span>
    );
}

type SocialContactSectionProps = {
    register: UseFormRegister<ProfileFormValues>;
};

export function SocialContactSection({
    register,
}: SocialContactSectionProps) {
    const t = useTranslations("Profile.socialContact");

    return (
        <section className="rounded-xl border border-separator bg-surface p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] md:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-accent-soft-hover)]">
                    <Share1Icon className="h-5 w-5 text-[color:var(--color-accent-soft-foreground)]" />
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-4">
                <div>
                    <label
                        htmlFor="zalo"
                        className={labelClass}
                    >
                        {t("zalo")}
                    </label>

                    <div className="relative">
                        <FieldIcon>
                            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#0068FF] font-label-sm text-[9px] font-bold text-white">
                                Zalo
                            </span>
                        </FieldIcon>

                        <input
                            id="zalo"
                            type="text"
                            placeholder={t("zaloPlaceholder")}
                            className={inputClass}
                            {...register("zaloNumber")}
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="whatsapp"
                        className={labelClass}
                    >
                        {t("whatsapp")}
                    </label>

                    <div className="relative">
                        <FieldIcon>
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="#25D366"
                            >
                                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.05-1.33A10 10 0 1 0 12 2Z" />
                            </svg>
                        </FieldIcon>

                        <input
                            id="whatsapp"
                            type="text"
                            placeholder={t("whatsappPlaceholder")}
                            className={inputClass}
                            {...register("whatAppsNumber")}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-[color:var(--color-background-tertiary)] px-4 py-2.5">
                <InfoCircledIcon className="h-4 w-4 shrink-0 text-link" />

                <span className="font-label-sm text-label-sm text-muted">
                    {t("contactNote")}
                </span>
            </div>
        </section>
    );
}

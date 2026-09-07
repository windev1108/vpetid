// app/profile/ProfilePage.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { ProfileTabs, ProfileTabKey } from "./components/ProfileTabs";
import { PersonalInformationSection } from "./components/PersonalInformationSection";
import { SocialContactSection } from "./components/SocialContactSection";
import { AccountSummarySection } from "./components/AccountSummarySection";
import { ProfileFormActions } from "./components/ProfileFormActions";
import { profileFormSchema, ProfileFormValues } from "./schema";
import { useProfile } from "@/services/auth/queries";
import { useUpdateProfile } from "@/services/auth/mutations";

function ProfilePageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-5xl xl:p-8 lg:p-6 p-4">
            <div className="mb-6 h-8 w-64 animate-pulse rounded-lg bg-default" />
            <div className="h-40 w-full animate-pulse rounded-xl bg-default" />
        </div>
    );
}

export default function ProfilePage() {
    const t = useTranslations("Profile");

    const [activeTab, setActiveTab] = useState<ProfileTabKey>("profile");

    const { data: profile, isPending: isLoading } = useProfile();
    const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        values: profile
            ? {
                firstName: profile.firstName ?? "",
                lastName: profile.lastName ?? "",
                phoneNumber: profile.phoneNumber ?? "",
                email: profile.email,
                zaloNumber: profile.zaloNumber ?? "",
                whatAppsNumber: profile.whatAppsNumber ?? "",
            }
            : undefined,
    });

    async function onSubmit(values: ProfileFormValues) {
        const { email, ...rest } = values;

        const payload = Object.fromEntries(
            Object.entries(rest).filter(([, value]) => value !== "")
        ) as Partial<Omit<ProfileFormValues, "email">>;

        try {
            await updateProfile(payload);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    }

    if (isLoading || !profile) {
        return <ProfilePageSkeleton />;
    }

    return (
        <div className="mx-auto w-full xl:p-8 lg:p-6 p-4">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="mb-1 font-headline-lg-mobile text-headline-lg-mobile text-foreground md:font-headline-lg md:text-headline-lg">
                        {t("title")}
                    </h1>

                    <p className="font-body-md text-body-md text-muted">
                        {t("subtitle")}
                    </p>
                </div>

                {/* 
                <ProfileHeaderCard
                    firstName={profile.firstName ?? ""}
                    lastName={profile?.lastName ?? ""}
                    role={profile?.role}
                    memberSince={profile.createdAt}
                    avatarUrl={profile.avatarUrl ?? ""}
                />
                */}
            </div>

            <div className="mb-8">
                <ProfileTabs
                    active={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {activeTab === "profile" && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col gap-6"
                >
                    <PersonalInformationSection
                        register={register}
                        errors={errors}
                        isPhoneVerified={!!profile.phoneVerifiedAt}
                        isEmailVerifiedViaGoogle={!!profile.emailVerifiedAt}
                    />

                    <SocialContactSection register={register} />

                    <AccountSummarySection
                        accountType={profile.role}
                        memberSince={profile.createdAt}
                        isActive={profile.status === "ACTIVE"}
                    />

                    <ProfileFormActions
                        isPending={isPending}
                        isDirty={isDirty}
                    />
                </form>
            )}

            {activeTab === "security" && (
                <div className="rounded-xl border border-dashed border-separator bg-surface p-10 text-center font-body-md text-body-md text-muted">
                    {t("comingSoon.security")}
                </div>
            )}

            {activeTab === "notifications" && (
                <div className="rounded-xl border border-dashed border-separator bg-surface p-10 text-center font-body-md text-body-md text-muted">
                    {t("comingSoon.notifications")}
                </div>
            )}
        </div>
    );
}

"use client";

import { useTranslations } from "next-intl";
import { Button, Card, Chip } from "@heroui/react";
import { Pet, PetStatus } from "@/services/pets/types";
import { formatDate } from "@/lib/utils";
import QRCode from "react-qr-code";

interface IdentityTabProps {
    pet: Pet;
}

export function IdentityTab({ pet }: IdentityTabProps) {
    const t = useTranslations("PetDetail.identityTab");
    const data = pet as Pet & Record<string, unknown>;
    const tCommon = useTranslations("");

    const getString = (...keys: string[]) => {
        for (const key of keys) {
            const value = data[key];
            if (value !== undefined && value !== null && String(value).trim() !== "") {
                return String(value);
            }
        }
        return null;
    };

    const petCode = pet.petCode;
    const statusMeta: Record<PetStatus, { label: string; chipColor: "success" | "danger" | "default" }> = {
        ACTIVE: { label: tCommon("safe"), chipColor: "success" },
        LOST: { label: tCommon("lost"), chipColor: "danger" },
        DECEASED: { label: tCommon("deceased"), chipColor: "default" },
    };
    const status = statusMeta[pet.status];

    const microchipNumber = getString("microchipNumber", "microchip", "microchipId");
    const microchipManufacturer = getString("microchipManufacturer", "manufacturer");
    const microchipStatus = getString("microchipStatus") || (microchipNumber ? t("identityTag.registered") : null);
    const registrationDatabase = getString("registrationDatabase", "microchipDatabase");
    const existingTagId = getString("existingTagId", "tagId", "physicalTagId");
    const cityLicense = getString("cityLicense", "licenseNumber");
    const registeredAt = getString("registeredAt", "createdAt", "registrationDate");
    const vaccination = getString("rabiesVaccination", "vaccinationDate");
    const healthCertificate = getString("healthCertificate", "healthCertificateUrl");
    const birthdate = getString("birthdate", "birthDate", "dateOfBirth");
    const age = getString("age");

    const copyPetCode = async () => {
        try {
            await navigator.clipboard.writeText(petCode);
        } catch {
            // Ignore clipboard errors.
        }
    };

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const petUrl = `${baseUrl}/public/${pet?.petCode}`;

    return (
        <div className="flex flex-col gap-4">
            {/* TOP ROW */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                <Card variant="default" className="border border-separator shadow-level-1 xl:col-span-2">
                    <Card.Content className="p-5 md:p-6">
                        <div className="mb-5 flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                                    <span className="material-symbols-outlined">qr_code_2</span>
                                </div>
                                <div>
                                    <h2 className="font-semibold text-foreground">{t("identityTag.title")}</h2>
                                    <p className="mt-0.5 text-xs text-muted">{t("identityTag.subtitle")}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-background-secondary hover:text-foreground"
                                aria-label={t("identityTag.expand")}
                            >
                                <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[170px_1fr]">
                            <div className="flex flex-col items-center">
                                <div className="flex aspect-square w-full max-w-[155px] items-center justify-center rounded-2xl border border-separator bg-white p-3 shadow-sm">
                                    <QRCode value={petUrl} size={180} bgColor="#ffffff" fgColor="#111827" level="H" />
                                </div>
                            </div>

                            <div className="flex flex-col justify-center divide-y divide-separator">
                                <IdentityRow label={t("identityTag.petIdCode")} value={petCode} copy onCopy={copyPetCode} />

                                <IdentityRow
                                    label={t("identityTag.status")}
                                    value={
                                        <Chip
                                            size="sm"
                                            color={status.chipColor === "default" ? undefined : status.chipColor}
                                            className="h-6"
                                        >
                                            <Chip.Label>{status.label}</Chip.Label>
                                        </Chip>
                                    }
                                />

                                <IdentityRow
                                    label={t("identityTag.microchip")}
                                    value={microchipNumber ? t("identityTag.registered") : t("identityTag.notRegistered")}
                                />

                                {registeredAt && (
                                    <IdentityRow label={t("identityTag.registeredOn")} value={formatDate(registeredAt)} />
                                )}
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <Button variant="secondary" className="w-full border border-accent text-accent">
                                <span className="material-symbols-outlined text-[18px]">download</span>
                                {t("identityTag.downloadTag")}
                            </Button>

                            <Button variant="secondary" className="w-full">
                                <span className="material-symbols-outlined text-[18px]">print</span>
                                {t("identityTag.printTag")}
                            </Button>
                        </div>
                    </Card.Content>
                </Card>

                {/* Basic Information */}
                <Card variant="default" className="border border-separator shadow-level-1 xl:col-span-3">
                    <Card.Content className="p-5 md:p-6">
                        <SectionHeader
                            icon="pets"
                            title={t("basicInfo.title")}
                            description={t("basicInfo.subtitle")}
                        />

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <InfoField label={t("basicInfo.petName")} value={pet.name} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("basicInfo.species")} value={getString("species")} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("basicInfo.breed")} value={pet.breed} notProvidedLabel={t("notProvided")} />

                            <div className="md:col-span-1">
                                <InfoField
                                    label={t("basicInfo.gender")}
                                    value={getString("gender")?.toLowerCase() === "female" ? tCommon("PetDetail.overview.atAGlance.female") : getString("gender")?.toLowerCase() === 'male' ? tCommon("PetDetail.overview.atAGlance.male") : '--'}
                                    notProvidedLabel={t("notProvided")}
                                    icon={getString("gender")?.toLowerCase() === "female" ? "female" : getString("gender")?.toLowerCase() === 'male' ? "male" : '--'}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <InfoField
                                    label={t("basicInfo.birthdateAge")}
                                    value={
                                        age
                                            ? `${age}${birthdate ? ` (${formatDate(birthdate)})` : ""}`
                                            : birthdate
                                                ? formatDate(birthdate)
                                                : null
                                    }
                                    notProvidedLabel={t("notProvided")}
                                    icon="calendar_month"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success/5 px-4 py-3 text-xs text-success">
                            <span className="material-symbols-outlined text-[18px]">verified_user</span>
                            <span>{t("basicInfo.verifiedNote")}</span>
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* SECOND ROW */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <Card variant="default" className="border border-separator shadow-level-1">
                    <Card.Content className="p-5 md:p-6">
                        <SectionHeader
                            icon="memory"
                            title={t("microchipInfo.title")}
                            description={t("microchipInfo.subtitle")}
                            trailing={
                                microchipNumber ? (
                                    <span className="material-symbols-outlined text-success">verified_user</span>
                                ) : null
                            }
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <InfoField label={t("microchipInfo.number")} value={microchipNumber} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("microchipInfo.manufacturer")} value={microchipManufacturer} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("microchipInfo.status")} value={microchipStatus} status={!!microchipStatus} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("microchipInfo.database")} value={registrationDatabase} notProvidedLabel={t("notProvided")} />
                        </div>

                        {!microchipNumber && <EmptyNotice>{t("microchipInfo.empty")}</EmptyNotice>}
                    </Card.Content>
                </Card>

                <Card variant="default" className="border border-separator shadow-level-1">
                    <Card.Content className="p-5 md:p-6">
                        <SectionHeader
                            icon="description"
                            title={t("linkedIds.title")}
                            description={t("linkedIds.subtitle")}
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <InfoField label={t("linkedIds.existingTagId")} value={existingTagId} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("linkedIds.cityLicense")} value={cityLicense} notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("linkedIds.rabiesVaccination")} value={vaccination} icon="calendar_month" notProvidedLabel={t("notProvided")} />
                            <InfoField label={t("linkedIds.healthCertificate")} value={healthCertificate} icon="upload_file" notProvidedLabel={t("notProvided")} />
                        </div>

                        {!existingTagId && !cityLicense && !vaccination && !healthCertificate && (
                            <EmptyNotice>{t("linkedIds.empty")}</EmptyNotice>
                        )}
                    </Card.Content>
                </Card>
            </div>

            {/* SECURITY NOTICE */}
            <div className="flex items-start gap-3 rounded-xl border border-accent/10 bg-accent/5 px-4 py-3 text-xs text-muted md:items-center">
                <span className="material-symbols-outlined shrink-0 text-[18px] text-accent">info</span>
                <p>{t("securityNotice")}</p>
            </div>
        </div>
    );
}

function SectionHeader({
    icon,
    title,
    description,
    trailing,
}: {
    icon: string;
    title: string;
    description: string;
    trailing?: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex items-start justify-between">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
                <div>
                    <h2 className="font-semibold text-foreground">{title}</h2>
                    <p className="mt-0.5 text-xs text-muted">{description}</p>
                </div>
            </div>
            {trailing}
        </div>
    );
}

function InfoField({
    label,
    value,
    icon,
    status,
    notProvidedLabel,
}: {
    label: string;
    value?: string | null;
    icon?: string;
    status?: boolean;
    notProvidedLabel: string;
}) {
    return (
        <div className="min-h-[72px] rounded-xl border border-separator bg-background-secondary/40 px-4 py-3">
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted">
                {icon && <span className="material-symbols-outlined text-[15px]">{icon}</span>}
                <span>{label}</span>
            </div>

            {value ? (
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {status && <span className="h-2 w-2 rounded-full bg-success" />}
                    <span className="truncate">{value}</span>
                </div>
            ) : (
                <span className="text-sm text-muted">{notProvidedLabel}</span>
            )}
        </div>
    );
}

function IdentityRow({
    label,
    value,
    copy,
    onCopy,
}: {
    label: string;
    value: React.ReactNode;
    copy?: boolean;
    onCopy?: () => void;
}) {
    return (
        <div className="flex min-h-[48px] items-center justify-between gap-3 py-2.5">
            <span className="text-xs text-muted">{label}</span>
            <div className="flex min-w-0 items-center gap-2 text-right text-sm font-medium text-foreground">
                <span className="truncate">{value}</span>
                {copy && (
                    <button
                        type="button"
                        onClick={onCopy}
                        className="shrink-0 text-muted transition hover:text-accent"
                        aria-label="Copy pet ID"
                    >
                        <span className="material-symbols-outlined text-[17px]">content_copy</span>
                    </button>
                )}
            </div>
        </div>
    );
}

function EmptyNotice({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-4 rounded-xl border border-dashed border-separator px-4 py-3 text-xs text-muted">
            {children}
        </div>
    );
}
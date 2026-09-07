// app/p/[code]/components/PublicContactOwnerCard.tsx
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import { PersonIcon, ChatBubbleIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";

type ContactChannel = {
    key: "zalo" | "whatsapp" | "facebook";
    label: string;
    displayValue: string;
    logoUrl: string;
    buttonLabel: string;
    buttonIcon: React.ReactNode;
    onPress: () => void;
};

type PublicContactOwnerCardProps = {
    ownerPhone?: string;
    zaloNumber?: string;
    whatsAppNumber?: string;
};

export function PublicContactOwnerCard({
    ownerPhone,
    zaloNumber,
    whatsAppNumber,
}: PublicContactOwnerCardProps) {
    const t = useTranslations("PublicPet.contactOwner");
    const channels: ContactChannel[] = [];

    if (zaloNumber) {
        channels.push({
            key: "zalo",
            label: "Zalo",
            displayValue: zaloNumber,
            logoUrl: "https://hddt78.hilo.com.vn/Content/img/zalo.png",
            buttonLabel: t("chatVia", { channel: "Zalo" }),
            buttonIcon: <ChatBubbleIcon className="h-4 w-4" />,
            onPress: () => window.open(`https://zalo.me/${zaloNumber}`, "_blank"),
        });
    }

    if (whatsAppNumber) {
        const digits = whatsAppNumber.replace(/[^\d]/g, "");
        channels.push({
            key: "whatsapp",
            label: "WhatsApp",
            displayValue: whatsAppNumber,
            logoUrl:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/WhatsApp_Logo_green.svg/250px-WhatsApp_Logo_green.svg.png",
            buttonLabel: t("chatVia", { channel: "WhatsApp" }),
            buttonIcon: <ChatBubbleIcon className="h-4 w-4" />,
            onPress: () => window.open(`https://wa.me/${digits}`, "_blank"),
        });
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-separator bg-surface p-6 md:p-8">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success-soft-hover)]">
                    <PersonIcon className="h-5 w-5 text-[color:var(--color-success-soft-foreground)]" />
                </div>
                <div>
                    <h3 className="font-headline-md text-headline-md text-foreground">{t("title")}</h3>
                    <p className="font-body-md text-body-md text-muted">{t("subtitle")}</p>
                </div>
            </div>

            {ownerPhone && (
                <div className="flex items-start gap-3 rounded-xl border border-separator bg-background-secondary p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-success-soft-hover)]">
                        <span className="material-symbols-outlined text-[20px] text-[color:var(--color-success-soft-foreground)]">
                            call
                        </span>
                    </div>
                    <div>
                        <p className="font-label-sm text-label-sm uppercase tracking-wide text-muted">
                            {t("phoneLabel")}
                        </p>
                        <a
                            href={`tel:${ownerPhone}`}
                            className="font-headline-md text-headline-md font-bold text-[color:var(--color-success-soft-foreground)] hover:underline"
                        >
                            {ownerPhone}
                        </a>
                        <p className="mt-1 font-label-sm text-label-sm text-muted">{t("phoneNote")}</p>
                    </div>
                </div>
            )}

            {channels.length > 0 && (
                <div>
                    <p className="mb-2 font-label-sm text-label-sm text-muted">{t("moreWays")}</p>
                    <div className="divide-y divide-separator rounded-xl border border-separator">
                        {channels.map((channel) => (
                            <div
                                key={channel.key}
                                onClick={channel.onPress}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-background-secondary"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                                    <Image
                                        width={36}
                                        height={36}
                                        alt={channel.label}
                                        unoptimized
                                        src={channel.logoUrl}
                                        className="object-contain"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="font-label-sm text-label-sm text-muted">{channel.label}</p>
                                    <p className="truncate font-label-md text-label-md font-semibold text-foreground">
                                        {channel.displayValue}
                                    </p>
                                </div>

                                <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted" />

                                <Button
                                    variant="outline"
                                    onPress={channel.onPress}
                                    className="ml-2 hidden shrink-0 items-center gap-2 border-[color:var(--color-success-soft-foreground)]/40 font-label-sm text-label-sm font-semibold text-[color:var(--color-success-soft-foreground)] sm:flex"
                                >
                                    {channel.buttonIcon}
                                    {channel.buttonLabel}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
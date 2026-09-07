"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, Select, ListBox, Label } from "@heroui/react";
import { useUpdateHealthReminder } from "@/services/health/mutations";
import type { HealthReminderConfig, ReminderChannel } from "@/services/health/types";

const REMINDER_DAYS = [1, 3, 7, 14, 30] as const;
const CHANNEL_VALUES: ReminderChannel[] = ["IN_APP", "PUSH", "EMAIL", "SMS"];

export function VaccinationReminderCard({
    petId,
    reminder,
}: {
    petId: string;
    reminder: HealthReminderConfig;
}) {
    const t = useTranslations("PetDetail.reminder");
    const { mutate: updateReminder, isPending } = useUpdateHealthReminder(petId);
    const [localReminder, setLocalReminder] = useState(reminder);

    function update(patch: Partial<HealthReminderConfig>) {
        const next = { ...localReminder, ...patch };
        setLocalReminder(next);
        updateReminder({
            enabled: next.enabled,
            remindBeforeDays: next.remindBeforeDays,
            channels: next.channels,
            timezone: next.timezone,
        });
    }

    function toggleChannel(channel: ReminderChannel) {
        const exists = localReminder.channels.includes(channel);
        const channels = exists
            ? localReminder.channels.filter((item) => item !== channel)
            : [...localReminder.channels, channel];
        update({ channels });
    }

    return (
        <Card className="border border-separator shadow-level-1">
            <Card.Content className="p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10">
                        <span className="material-symbols-outlined text-[19px] text-accent">notifications</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{t("title")}</h3>
                        <p className="mt-1 text-xs leading-5 text-muted">{t("subtitle")}</p>
                    </div>
                </div>

                <div className="mt-5 space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">{t("enableLabel")}</p>
                            <p className="text-xs text-muted">{t("enableSubtitle")}</p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={localReminder.enabled}
                            disabled={isPending}
                            onClick={() => update({ enabled: !localReminder.enabled })}
                            className={`relative h-6 w-11 rounded-full transition ${
                                localReminder.enabled ? "bg-accent" : "bg-background-secondary"
                            }`}
                        >
                            <span
                                className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                    localReminder.enabled ? "left-6" : "left-1"
                                }`}
                            />
                        </button>
                    </div>

                    {localReminder.enabled && (
                        <>
                            <Select
                                value={String(localReminder.remindBeforeDays)}
                                onChange={(value) => update({ remindBeforeDays: Number(value) })}
                                variant="secondary"
                            >
                                <Label>{t("remindMe")}</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>

                                <Select.Popover>
                                    <ListBox>
                                        {REMINDER_DAYS.map((days) => (
                                            <ListBox.Item key={days} id={String(days)}>
                                                <Label>{t(`days.${days}`)}</Label>
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            <div>
                                <p className="text-xs font-medium text-foreground">{t("notifyVia")}</p>

                                <div className="mt-3 space-y-3">
                                    {CHANNEL_VALUES.map((channel) => {
                                        const checked = localReminder.channels.includes(channel);
                                        const smsDisabled = channel === "SMS";

                                        return (
                                            <label
                                                key={channel}
                                                className={`flex items-center gap-2.5 text-sm ${
                                                    smsDisabled ? "cursor-not-allowed text-muted" : "cursor-pointer text-foreground"
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    disabled={smsDisabled || isPending}
                                                    onChange={() => toggleChannel(channel)}
                                                    className="h-4 w-4 rounded border-separator accent-accent"
                                                />
                                                <span>{t(`channels.${channel}`)}</span>
                                                {smsDisabled && (
                                                    <span className="rounded-full bg-background-secondary px-2 py-0.5 text-[10px] text-muted">
                                                        {t("comingSoon")}
                                                    </span>
                                                )}
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Card.Content>
        </Card>
    );
}
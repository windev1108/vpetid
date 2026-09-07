// app/dashboard/components/DashboardStats.tsx
"use client";

import { motion } from "motion/react";

type Stat = {
    label: string;
    value: string | number;
    icon: string;
    tone?: StatTone;
    hint?: string;
};

type DashboardStatsProps = {
    stats: Stat[];
};

type StatTone = "accent" | "success" | "danger" | "info" | "default";

const TONE_CLASSES: Record<StatTone, { icon: string; bg: string }> = {
    accent: { bg: "bg-[color:var(--color-accent-soft-hover)]", icon: "text-[color:var(--color-accent-soft-foreground)]" },
    success: { bg: "bg-[color:var(--color-success-soft-hover)]", icon: "text-[color:var(--color-success-soft-foreground)]" },
    danger: { bg: "bg-[color:var(--color-danger-soft-hover)]", icon: "text-[color:var(--color-danger-soft-foreground)]" },
    info: { bg: "bg-indigo-100", icon: "text-indigo-500" },
    default: { bg: "bg-default", icon: "text-default-foreground" },
};

export function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => {
                const tone = TONE_CLASSES[stat.tone ?? "default"];

                return (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className="flex items-center gap-4 rounded-xl border border-separator bg-surface p-5 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0px_8px_28px_rgba(15,23,42,0.08)]"
                    >
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone.bg}`}>
                            <span className={`material-symbols-outlined text-[22px] ${tone.icon}`}>
                                {stat.icon}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <div className="font-headline-md text-headline-md text-foreground">
                                {stat.value}
                            </div>
                            <div className="font-label-md text-label-md text-muted">
                                {stat.label}
                            </div>
                            {stat.hint && (
                                <div className="mt-0.5 font-label-sm text-label-sm text-default-foreground">
                                    {stat.hint}
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
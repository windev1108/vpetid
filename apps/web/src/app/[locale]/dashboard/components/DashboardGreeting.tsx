import { Avatar, AvatarFallback, AvatarImage } from "@heroui/react";
import { useTranslations } from "next-intl";

// app/dashboard/components/DashboardGreeting.tsx


type DashboardGreetingProps = {
    userName: string;
    petCount: number;
    petPreviews?: { photoUrl: string; name: string }[];
};

export function DashboardGreeting({ userName, petCount, petPreviews = [] }: DashboardGreetingProps) {
    const t = useTranslations()
    const greeting = getTimeGreeting(new Date());

    function getTimeGreeting(date: Date) {
        const hour = date.getHours();
        if (hour < 12) return t('greeting_morning');
        if (hour < 18) return t("greeting_afternoon");
        return t("greeting_night");
    }

    return (
        <div className="relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-separator bg-gradient-to-br from-[color:var(--color-accent-soft-hover)] to-surface p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
            <span className="material-symbols-outlined pointer-events-none absolute -right-8 -top-8 text-[160px] text-[color:var(--color-accent-soft-foreground)]/10">
                shield
            </span>

            <div className="relative z-10">
                <h1 className="mb-1 font-headline-lg-mobile text-headline-lg-mobile text-foreground md:font-headline-lg md:text-headline-xl">
                    {greeting}, {userName} <span>👋</span>
                </h1>
                <p className="font-body-md text-body-md text-muted">
                    {petCount > 0
                        ? t("greeting_message", { petCount, s: petCount > 1 ? "s" : '' })
                        : "Let's set up your first digital Pet ID."}
                </p>
            </div>

            {petPreviews.length > 0 && (
                <div className="relative z-10 flex -space-x-4">
                    {petPreviews.slice(0, 2).map((p) => (
                        <Avatar key={p.name} size="lg" className="size-24 rounded-full">
                            <AvatarImage src={p.photoUrl}  />
                            <AvatarFallback>{p.name.slice(0, 1)}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            )}
        </div>
    );
}
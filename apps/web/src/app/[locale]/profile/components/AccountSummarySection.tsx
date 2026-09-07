import { formatDate } from "@/lib/utils";
import {
    PersonIcon,
    CalendarIcon,
    CheckCircledIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type AccountSummarySectionProps = {
    accountType: string;
    memberSince: string;
    isActive: boolean;
};

export function AccountSummarySection({
    accountType,
    memberSince,
    isActive,
}: AccountSummarySectionProps) {
    const t = useTranslations("Profile.accountSummary");

    return (
        <section className="rounded-xl border border-separator bg-surface p-6 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] md:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-accent-soft-hover)]">
                    <CheckCircledIcon className="h-5 w-5 text-[color:var(--color-accent-soft-foreground)]" />
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-separator bg-background-secondary p-4">
                    <p className="mb-2 font-label-sm text-label-sm text-muted">
                        {t("accountType")}
                    </p>

                    <p className="flex items-center gap-2 font-label-md text-label-md font-semibold text-foreground">
                        <PersonIcon className="h-4 w-4 text-[color:var(--color-success-soft-foreground)]" />
                        {accountType}
                    </p>
                </div>

                <div className="rounded-lg border border-separator bg-background-secondary p-4">
                    <p className="mb-2 font-label-sm text-label-sm text-muted">
                        {t("memberSince")}
                    </p>

                    <p className="flex items-center gap-2 font-label-md text-label-md font-semibold text-foreground">
                        <CalendarIcon className="h-4 w-4 text-[color:var(--color-success-soft-foreground)]" />
                        {formatDate(memberSince)}
                    </p>
                </div>

                <div className="rounded-lg border border-separator bg-background-secondary p-4">
                    <p className="mb-2 font-label-sm text-label-sm text-muted">
                        {t("accountStatus")}
                    </p>

                    <p className="flex items-center gap-2 font-label-md text-label-md font-semibold text-foreground">
                        <span
                            className={`h-2 w-2 rounded-full ${
                                isActive
                                    ? "bg-[color:var(--color-success-soft-foreground)]"
                                    : "bg-muted"
                            }`}
                        />

                        {isActive
                            ? t("active")
                            : t("inactive")}
                    </p>
                </div>
            </div>
        </section>
    );
}

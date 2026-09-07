// app/dashboard/components/QuickActions.tsx
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { useTranslations } from "next-intl";

type QuickAction = {
    label: string;
    description: string;
    icon: string;
    href: string;
};



export function QuickActions() {
    const t = useTranslations();
    const ACTIONS: QuickAction[] = [
        {
            label: t("add_pet"),
            description: t("add_pet_subtitle"),
            icon: "add_circle",
            href: ROUTES.CREATE_PET,
        },
        // {
        //     label: "Order Tag",
        //     description: "Get a physical ID tag",
        //     icon: "local_shipping",
        //     href: "/order-tag",
        // },
        // {
        //     label: "Scan QR",
        //     description: "Look up a pet by code",
        //     icon: "qr_code_scanner",
        //     href: "/scan",
        // },
        {
            label: t("profile"),
            description: t("add_profile_subtitle"),
            icon: "person",
            href: "/profile",
        },
    ];
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ACTIONS.map((action) => (
                <Link
                    key={action.label}
                    href={action.href}
                    className="group flex items-center gap-4 rounded-xl border border-separator bg-surface p-4 shadow-[0px_4px_20px_rgba(15,23,42,0.05)] transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[0px_8px_28px_rgba(15,23,42,0.08)]"
                >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-accent-soft-hover)] transition-colors group-hover:bg-accent">
                        <span className="material-symbols-outlined text-[20px] text-[color:var(--color-accent-soft-foreground)] transition-colors group-hover:text-accent-foreground">
                            {action.icon}
                        </span>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="font-label-md text-label-md font-semibold text-foreground">{action.label}</div>
                        <div className="mt-0.5 truncate font-label-sm text-label-sm text-muted">{action.description}</div>
                    </div>
                    <span className="material-symbols-outlined shrink-0 text-[20px] text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                        chevron_right
                    </span>
                </Link>
            ))}
        </div>
    );
}
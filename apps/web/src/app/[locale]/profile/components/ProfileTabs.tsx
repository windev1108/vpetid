"use client";

import { PersonIcon, LockClosedIcon, BellIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

export type ProfileTabKey =
    | "profile"
    | "security"
    | "notifications";

type TabConfig = {
    key: ProfileTabKey;
    labelKey: "profile" | "security" | "notifications";
    icon: React.ReactNode;
};

const TABS: TabConfig[] = [
    {
        key: "profile",
        labelKey: "profile",
        icon: <PersonIcon className="h-4 w-4" />,
    },

    // Uncomment when these sections are implemented
    // {
    //     key: "security",
    //     labelKey: "security",
    //     icon: <LockClosedIcon className="h-4 w-4" />,
    // },
    // {
    //     key: "notifications",
    //     labelKey: "notifications",
    //     icon: <BellIcon className="h-4 w-4" />,
    // },
];

type ProfileTabsProps = {
    active: ProfileTabKey;
    onChange: (tab: ProfileTabKey) => void;
};

export function ProfileTabs({
    active,
    onChange,
}: ProfileTabsProps) {
    const t = useTranslations("Profile.tabs");

    return (
        <div className="flex gap-6 border-b border-separator">
            {TABS.map((tab) => {
                const isActive = active === tab.key;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={`flex items-center gap-2 border-b-2 px-1 pb-3 font-label-md text-label-md font-semibold transition-colors ${isActive
                            ? "border-accent text-accent"
                            : "border-transparent text-muted hover:text-foreground"
                            }`}
                    >
                        {tab.icon}
                        {t(tab.labelKey)}
                    </button>
                );
            })}
        </div>
    );
}

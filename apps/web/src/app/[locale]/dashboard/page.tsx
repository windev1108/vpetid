// app/dashboard/page.tsx
'use client'
import { DashboardGreeting } from "./components/DashboardGreeting";
import { DashboardStats } from "./components/DashboardStats";
import { QuickActions } from "./components/QuickActions";
import { PetList } from "./components/PetList";
import { usePets } from "@/services/pets/queries";
import { useUser } from "@/hooks/useUser";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
    // const activeCount = 4;
    // const alertCount = 0;
    const { data: pets = [] } = usePets()
    const { displayName } = useUser()
    const t = useTranslations()
    // const stats = [
    //     {
    //         label: "Total Pets",
    //         value: pets.length,
    //         icon: "pets",
    //         tone: "accent" as const,
    //     },
    //     {
    //         label: "Active Tags",
    //         value: activeCount,
    //         icon: "verified",
    //         tone: "success" as const,
    //         hint: activeCount < pets.length ? `${pets.length - activeCount} pending` : undefined,
    //     },
    //     {
    //         label: "Alerts",
    //         value: alertCount,
    //         icon: "notifications",
    //         tone: alertCount > 0 ? ("danger" as const) : ("default" as const),
    //         hint: alertCount === 0 ? "All clear" : undefined,
    //     },
    // ];

    return (
        <div className="min-h-screen bg-surface text-foreground">
            <main className="mx-auto flex w-full flex-col gap-10 xl:p-8 lg:p-6 p-4">
                <DashboardGreeting
                    userName={displayName}
                    petCount={pets?.length ?? 0}
                    petPreviews={pets?.map((p) => ({ photoUrl: p.avatarUrl ?? '', name: p.name }))}
                />

                {/* <DashboardStats stats={stats} /> */}

                <div>
                    <h2 className="mb-4 font-headline-md text-headline-md text-foreground">
                        {t("quick_actions")}
                    </h2>
                    <QuickActions />
                </div>

                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-headline-md text-headline-md text-foreground">
                            {t("my_pets")}
                        </h2>
                        <span className="font-label-md text-label-md text-muted">
                            {pets.length} {t("total_pets")}
                        </span>
                    </div>
                    <PetList pets={pets} />
                </div>
            </main>
        </div>
    );
}
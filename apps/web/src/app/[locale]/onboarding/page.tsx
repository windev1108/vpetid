// app/onboarding/page.tsx
import { OnboardingHero } from "./components/OnboardingHero";
import { OnboardingSteps } from "./components/OnboardingSteps";
import { ROUTES } from "@/lib/routes";
import { Link } from "@/i18n/navigation";

const TOTAL_STEPS = 3;
const ACTIVE_STEP = 1;

export default function OnboardingPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
            <div className="flex min-h-[600px] w-full max-w-container-max flex-col overflow-hidden rounded-2xl bg-surface shadow-[0px_4px_20px_rgba(15,23,42,0.05)] md:flex-row">
                <OnboardingHero />

                <div className="flex w-full flex-col justify-between p-8 md:w-1/2 md:p-12 lg:p-16">
                    <div className="mb-8">
                        <Link href={ROUTES.HOME} className="mb-12 flex items-center gap-2">
                            <span
                                className="material-symbols-outlined text-3xl text-link"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                badge
                            </span>
                            <span className="font-headline-md text-headline-md font-bold tracking-tight text-link">
                                VPetId
                            </span>
                        </Link>

                        <h1 className="mb-stack-md font-headline-lg text-headline-lg text-foreground md:font-headline-xl md:text-headline-xl">
                            Let&apos;s create your first Pet ID.
                        </h1>
                        <p className="mb-stack-lg font-body-lg text-body-lg text-muted">
                            Follow these simple steps to secure your pet&apos;s digital identity
                            and gain peace of mind.
                        </p>

                        <OnboardingSteps activeStep={ACTIVE_STEP} />
                    </div>

                    <div className="mt-auto flex flex-col gap-6 pt-8">
                        <Link
                            href={ROUTES.CREATE_PET}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 font-label-md text-label-md font-semibold text-accent-foreground shadow-sm transition-all duration-200 hover:bg-[color:var(--color-accent-hover)] active:scale-95"
                        >
                            <span className="material-symbols-outlined">pets</span>
                            Add My First Pet
                        </Link>

                        <div className="flex items-center justify-center gap-2">
                            {Array.from({ length: TOTAL_STEPS }).map((_, index) => {
                                const stepNumber = index + 1;
                                const isActive = stepNumber === ACTIVE_STEP;

                                return (
                                    <div
                                        key={stepNumber}
                                        className={`h-2 rounded-full transition-all ${isActive
                                            ? "w-8 bg-accent"
                                            : "w-2 bg-separator"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
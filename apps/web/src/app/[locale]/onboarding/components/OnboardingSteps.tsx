// app/onboarding/components/OnboardingSteps.tsx
type Step = {
    title: string;
    description: string;
};

const STEPS: Step[] = [
    {
        title: "Create your pet profile",
        description:
            "Add photos, name, breed, and critical medical details to complete their digital record.",
    },
    {
        title: "Get a unique VPetId",
        description:
            "Generate a secure digital identity and a unique QR code specifically for your pet.",
    },
    {
        title: "Protect your pet with QR and GPS",
        description:
            "Link their ID to smart tags and enable real-time tracking for ultimate safety.",
    },
];

export function OnboardingSteps({ activeStep = 1 }: { activeStep?: number }) {
    return (
        <div className="space-y-stack-md">
            {STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === activeStep;

                return (
                    <div
                        key={step.title}
                        className={`flex gap-4 rounded-xl border p-4 transition-colors ${isActive
                                ? "border-separator bg-background-secondary hover:border-accent"
                                : "border-separator/50 opacity-70"
                            }`}
                    >
                        <div
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-label-md font-bold ${isActive
                                    ? "bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]"
                                    : "bg-default text-default-foreground"
                                }`}
                        >
                            {stepNumber}
                        </div>
                        <div>
                            <h3 className="mb-1 text-[18px] font-semibold leading-[28px] text-foreground">
                                {step.title}
                            </h3>
                            <p className="font-body-md text-body-md text-muted">
                                {step.description}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
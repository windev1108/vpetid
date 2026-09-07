// app/create-pet/components/PetFormStepper.tsx
type Step = {
    id: number;
    label: string;
    description: string;
};

const STEPS: Step[] = [
    { id: 1, label: "Basic Info", description: "Name, species, breed..." },
    { id: 2, label: "Physical", description: "Appearance, size, weight..." },
    { id: 3, label: "Identification", description: "Microchip, tags, ID..." },
    { id: 4, label: "Review", description: "Confirm and save" },
];

export function PetFormStepper({ activeStep = 1 }: { activeStep?: number }) {
    return (
        <div className="mb-8 flex items-center overflow-x-auto rounded-xl border border-separator bg-surface p-5">
            {STEPS.map((step, index) => {
                const isActive = step.id === activeStep;
                const isDone = step.id < activeStep;

                return (
                    <div key={step.id} className="flex items-center">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-label-md text-label-md font-bold ${
                                    isActive || isDone
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-default text-default-foreground"
                                }`}
                            >
                                {isDone ? (
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                ) : (
                                    step.id
                                )}
                            </div>
                            <div className="hidden sm:block">
                                <div
                                    className={`font-label-md text-label-md font-semibold ${
                                        isActive ? "text-foreground" : "text-muted"
                                    }`}
                                >
                                    {step.label}
                                </div>
                                <div className="font-label-sm text-label-sm text-muted">
                                    {step.description}
                                </div>
                            </div>
                        </div>

                        {index < STEPS.length - 1 && (
                            <div className="mx-4 h-px w-8 shrink-0 bg-separator sm:w-12" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
// app/create-pet/components/PetFormSidebarActions.tsx
import { Button } from "@heroui/react";

type PetFormSidebarActionsProps = {
    isPending: boolean;
    submitLabel: string;
};

export function PetFormSidebarActions({ isPending, submitLabel }: PetFormSidebarActionsProps) {
    return (
        <div className="hidden flex-col gap-3 md:flex">
            <Button
                type="submit"
                isPending={isPending}
                className="w-full gap-2 bg-accent font-label-md text-label-md font-semibold text-accent-foreground hover:bg-[color:var(--color-accent-hover)]"
            >
                {submitLabel}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Button>
        </div>
    );
}
// app/pets/components/PetsEmptyState.tsx
import { ROUTES } from "@/lib/routes";
import { Link } from "@/i18n/navigation";

export function PetsEmptyState() {
    return (
        <div className="flex flex-col items-center rounded-[24px] border border-dashed border-separator bg-surface px-6 py-16 text-center">
            <span className="material-symbols-outlined mb-3 text-4xl text-link">
                pets
            </span>
            <h3 className="mb-1 font-headline-md text-[18px] font-semibold text-foreground">
                No pets yet
            </h3>
            <p className="mb-6 max-w-sm font-body-md text-body-md text-muted">
                Add your first pet to create their secure digital identity.
            </p>
            <Link
                href={ROUTES.CREATE_PET}
                className="rounded-lg bg-accent px-6 py-3 font-label-md text-label-md font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-[color:var(--color-accent-hover)]"
            >
                Add My First Pet
            </Link>
        </div>
    );
}
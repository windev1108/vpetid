// app/pets/components/PetsEmptyFilterState.tsx
export function PetsEmptyFilterState() {
    return (
        <div className="flex flex-col items-center rounded-[24px] border border-dashed border-separator bg-surface px-6 py-12 text-center">
            <span className="material-symbols-outlined mb-2 text-3xl text-muted">
                search_off
            </span>
            <p className="font-body-md text-body-md text-muted">
                No pets match your search.
            </p>
        </div>
    );
}
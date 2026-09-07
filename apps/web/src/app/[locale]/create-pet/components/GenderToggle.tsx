// app/create-pet/components/GenderToggle.tsx
type GenderToggleProps = {
    value: string | undefined;
    onChange: (value: "male" | "female") => void;
};

export function GenderToggle({ value, onChange }: GenderToggleProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                type="button"
                onClick={() => onChange("male")}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 font-label-md text-label-md font-semibold transition-colors ${
                    value === "male"
                        ? "border-accent bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]"
                        : "border-separator bg-surface text-muted hover:border-accent/40"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">male</span>
                Male
            </button>
            <button
                type="button"
                onClick={() => onChange("female")}
                className={`flex items-center justify-center gap-2 rounded-lg border py-2.5 font-label-md text-label-md font-semibold transition-colors ${
                    value === "female"
                        ? "border-accent bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]"
                        : "border-separator bg-surface text-muted hover:border-accent/40"
                }`}
            >
                <span className="material-symbols-outlined text-[18px]">female</span>
                Female
            </button>
        </div>
    );
}
// app/create-pet/components/SectionHeading.tsx
type SectionHeadingProps = {
    icon: string;
    title: string;
    description: string;
};

export function SectionHeading({ icon, title, description }: SectionHeadingProps) {
    return (
        <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--color-accent-soft-hover)]">
                <span className="material-symbols-outlined text-[20px] text-[color:var(--color-accent-soft-foreground)]">
                    {icon}
                </span>
            </div>
            <div>
                <h2 className="font-label-md text-label-md font-bold text-foreground">
                    {title}
                </h2>
                <p className="font-label-sm text-label-sm text-muted">{description}</p>
            </div>
        </div>
    );
}
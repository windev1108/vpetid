// app/p/[code]/components/PublicPetInfoGrid.tsx
type InfoItem = {
    icon: string;
    iconTone: "success" | "accent" | "danger" | "indigo" | "amber" | "blue";
    label: string;
    value: string;
};

const TONE_CLASS: Record<InfoItem["iconTone"], string> = {
    success: "bg-[color:var(--color-success-soft-hover)] text-[color:var(--color-success-soft-foreground)]",
    accent: "bg-[color:var(--color-accent-soft-hover)] text-[color:var(--color-accent-soft-foreground)]",
    danger: "bg-[color:var(--color-danger-soft-hover)] text-[color:var(--color-danger-soft-foreground)]",
    indigo: "bg-indigo-100 text-indigo-500",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-500",
};

function InfoRow({ item }: { item: InfoItem }) {
    return (
        <div className="flex items-start gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TONE_CLASS[item.iconTone]}`}>
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            </div>
            <div>
                <p className="font-label-sm text-label-sm uppercase tracking-widest text-default-foreground">
                    {item.label}
                </p>
                <p className="font-label-md text-label-md font-bold text-foreground">{item.value}</p>
            </div>
        </div>
    );
}

export function PublicPetInfoGrid({ columns }: { columns: InfoItem[][] }) {
    return (
        <div className="grid grid-cols-1 gap-6 divide-y divide-separator rounded-2xl border border-separator bg-background-secondary p-5 md:grid-cols-3 md:divide-x md:divide-y-0 md:p-6">
            {columns.map((col, i) => (
                <div key={i} className={`flex flex-col gap-5 ${i > 0 ? "pt-5 md:pt-0 md:pl-6" : ""}`}>
                    {col.map((item) => (
                        <InfoRow key={item.label} item={item} />
                    ))}
                </div>
            ))}
        </div>
    );
}
// app/profile/components/ProfileHeaderCard.tsx
type ProfileHeaderCardProps = {
    firstName: string;
    lastName: string
    role: string;
    memberSince: string;
    avatarUrl: string | null;
};

export function ProfileHeaderCard({ firstName, lastName, role, memberSince, avatarUrl }: ProfileHeaderCardProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-separator bg-surface px-4 py-3 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-background-secondary">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={firstName} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="material-symbols-outlined text-[22px] text-muted">person</span>
                    </div>
                )}
            </div>
            <div>
                <p className="font-label-md text-label-md font-semibold text-foreground">{`${firstName} ${lastName}`}</p>
                <p className="font-label-sm text-label-sm font-semibold text-accent">{role}</p>
                <p className="flex items-center gap-1 font-label-sm text-label-sm text-muted">
                    <span className="material-symbols-outlined text-[13px]">calendar_month</span>
                    Member since {memberSince}
                </p>
            </div>
        </div>
    );
}
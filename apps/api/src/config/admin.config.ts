export function getAdminEmails(): string[] {
    return (process.env.ADMIN_EMAILS ?? '')
        .split(',')
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);
}

export function isAdminEmail(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();

    return getAdminEmails().includes(normalizedEmail);
}
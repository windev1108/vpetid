import { AuthUser, useAuthState } from "@/store/auth.store"

interface UseUserReturn extends Partial<AuthUser> {
    displayName: string
}

export const useUser = (): UseUserReturn => {
    const { user } = useAuthState()
    return {
        ...user,
        displayName: Boolean(user?.firstName && user?.lastName) ? `${user?.firstName} ${user?.lastName}` : 'N/A'
    }
}
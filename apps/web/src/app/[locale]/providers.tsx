"use client";

import { useAuthBootstrap } from "@/services/auth/mutations";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
    const { isBootstrapping } = useAuthBootstrap();
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 30_000,
                    },
                },
            }),
    );
    if (isBootstrapping) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
            </div>
        );
    }

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
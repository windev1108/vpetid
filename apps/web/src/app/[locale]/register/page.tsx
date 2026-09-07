// app/register/page.tsx
import Image from "next/image";
import { RegisterForm } from "./components/RegisterForm";
import { SITE_CONFIG } from "@/config/site";
import { ROUTES } from "@/lib/routes";
import { Link } from "@/i18n/navigation";
import { RegisterHero } from "./components/RegisterHero";

export default function RegisterPage() {
    return (
        <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background lg:h-screen lg:flex-row lg:overflow-hidden">
            <RegisterHero />

            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 lg:hidden">
                <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-success/20 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-accent-soft-hover/30 blur-3xl" />
            </div>

            <div className="flex w-full flex-1 flex-col items-center justify-center px-margin-mobile py-10 sm:py-16 lg:w-1/2 lg:overflow-y-auto lg:bg-surface lg:px-margin-desktop lg:py-0">
                <div className="flex w-full max-w-md flex-col items-center rounded-3xl bg-surface p-6 shadow-level-2 sm:p-10 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none">
                    <Link href={ROUTES.HOME} className="mb-6 lg:mb-8 cursor-pointer">
                        <Image src={SITE_CONFIG.logoUrl} alt="VPetId Logo" width={140} height={64} unoptimized className="h-12 w-auto object-contain sm:h-14 lg:h-16" />
                    </Link>

                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-2xl font-semibold text-foreground sm:text-3xl lg:text-[32px]">
                            Create your account
                        </h1>
                        <p className="text-base text-muted">
                            Join thousands of pet parents securing their pet&apos;s digital identity.
                        </p>
                    </div>

                    <RegisterForm />

                    <div className="mt-8 flex flex-col items-center gap-2 text-center">
                        <p className="text-base text-muted">
                            Already have an account?{" "}
                            <Link href={ROUTES.LOGIN} className="font-medium text-accent transition-colors hover:text-accent-hover">
                                Sign in
                            </Link>
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-muted/70">
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                            <p className="text-xs">Your data is protected with bank-grade encryption.</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
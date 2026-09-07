// app/register/components/RegisterForm.tsx
"use client";

import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";

export function RegisterForm() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // TODO: gọi API đăng ký NestJS thật, ví dụ:
            // const res = await fetch("/api/auth/register", {
            //   method: "POST",
            //   headers: { "Content-Type": "application/json" },
            //   body: JSON.stringify({ fullName, email, phone, password }),
            // });
            // if (!res.ok) throw new Error("Đăng ký thất bại, vui lòng thử lại.");
            await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                    Full Name
                </label>
                <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-separator bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/40"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-separator bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/40"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Phone Number
                </label>
                <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-separator bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/40"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                </label>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="w-full rounded-lg border border-separator bg-surface px-4 py-3 pr-11 text-base text-foreground placeholder:text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/40"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-foreground"
                    >
                        <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="flex h-5 items-center">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded border-separator bg-surface text-accent transition-colors focus:ring-accent focus:ring-offset-background"
                    />
                </div>
                <label htmlFor="terms" className="cursor-pointer text-sm text-muted">
                    I agree to the{" "}
                    <Link href={ROUTES.TERMS} className="font-medium text-accent transition-colors hover:text-accent-hover">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href={ROUTES.PRIVACY} className="font-medium text-accent transition-colors hover:text-accent-hover">
                        Privacy Policy
                    </Link>
                    .
                </label>
            </div>

            {error && (
                <p role="alert" className="rounded-lg bg-danger-soft-hover/30 px-4 py-2 text-sm text-danger">
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isSubmitting ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground" />
                        Creating account…
                    </>
                ) : (
                    <>
                        Create Account
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                )}
            </button>

            <div className="my-1 flex w-full items-center gap-4">
                <div className="h-px flex-1 bg-separator" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Or</span>
                <div className="h-px flex-1 bg-separator" />
            </div>

            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-separator bg-background-secondary py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-default"
            >
                <GoogleIcon />
                Sign up with Google
            </button>
        </form>
    );
}
"use client";

import { GoogleIcon } from "@/app/components/icons/GoogleIcon";
import { useState, type FormEvent } from "react";
import { useRouter } from "@/i18n/navigation";

import { ROUTES } from "@/lib/routes";
import { useLogin } from "@/services/auth/mutations";
import { getGoogleLoginUrl } from "@/services/auth/api";
import { ApiError } from "@/services/client";

export function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useLogin();

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    router.push(ROUTES.DASHBOARD);
                },
            },
        );
    }

    function handleGoogleLogin() {
        // Full-page redirect sang backend, backend redirect tiếp sang Google.
        // Không dùng fetch() ở đây vì đây là điều hướng trình duyệt, không phải API call.
        window.location.href = getGoogleLoginUrl();
    }

    const errorMessage = loginMutation.error
        ? loginMutation.error instanceof ApiError
            ? loginMutation.error.message
            : "Đã có lỗi xảy ra, vui lòng thử lại."
        : null;

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
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
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password
                    </label>
                    <a href="#" className="text-sm font-medium text-accent transition-colors hover:text-accent-hover">
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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

            {errorMessage && (
                <p role="alert" className="rounded-lg bg-danger-soft-hover/30 px-4 py-2 text-sm text-danger">
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={loginMutation.isPending}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loginMutation.isPending ? (
                    <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground/40 border-t-accent-foreground" />
                        Signing in…
                    </>
                ) : (
                    "Sign In"
                )}
            </button>

            <div className="my-1 flex w-full items-center gap-4">
                <div className="h-px flex-1 bg-separator" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted">Or</span>
                <div className="h-px flex-1 bg-separator" />
            </div>

            <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-separator bg-background-secondary py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:bg-default"
            >
                <GoogleIcon />
                Continue with Google
            </button>
        </form>
    );
}
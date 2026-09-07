// app/register/components/RegisterHero.tsx
import Image from "next/image";

const heroImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCD2m-eTcGfXQYV94d79s6O0tgXocvBjLtkA8ZudMBhS8QyAHPy03SLX_Sj-_QVupibet8e6BdZT170OSpiQ_hq6UnwvbHpe5wqxjBmq0FcnnQrPBzL113jzsWKNMdM9_fwODezrXHwxxq2D6YumCLoLl4sDzPLE3D_F_XlnXrW_wBy6K-MvjfqMKZ7YDXH4qiyGF8h6a1YtMwvx_RqHDiKtYcodHWxJ46VJHwx3qXqSc1lMVGrlbHAmw";

export function RegisterHero() {
    return (
        <div className="relative hidden h-full w-1/2 overflow-hidden bg-background-tertiary lg:block">
            <Image
                src={heroImageUrl}
                alt="A pet owner relaxing with their Golden Retriever in a bright, modern living room"
                fill
                unoptimized
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

            <div className="absolute bottom-10 left-10 right-10 flex items-center gap-4 rounded-2xl bg-surface/90 p-6 shadow-level-2 backdrop-blur-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft-hover">
                    <span className="material-symbols-outlined filled text-accent-soft-foreground">pets</span>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-foreground">10,000+ pets protected</h3>
                    <p className="text-sm text-muted">Join thousands of happy pet parents worldwide.</p>
                </div>
            </div>
        </div>
    );
}
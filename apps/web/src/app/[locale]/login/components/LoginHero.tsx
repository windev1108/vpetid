import Image from "next/image";

const heroImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA9R6qdQGpbibsrJWdBlZW6EPoIIQSHJ9clnmlsM6MbO36hBVoe21rq4wUghDwOn0hsiHtNss8hq_9j-hIE4u0lRvyap_3cG_xEBk4o-yf0kwiyXtG32hQT2YUsDx_HBeyG6cXPsh6TQEYMSt_Ji6wX67AMHTrlItYmG0M3JtZeYHNoVhfMkuYS9EuUmkJ87FUbiWz7TSB5Fwkkz4m03ajD1gr5NvisLq-1DNhMjgnMkE-pCiuejVCckQ";

export function LoginHero() {
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
            {/* Brand tint overlay */}
            <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

            {/* Floating trust card, consistent with the homepage hero */}
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
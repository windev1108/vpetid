import { SITE_CONFIG } from "@/config/site";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="mt-auto w-full border-t border-separator/20 bg-background-secondary py-8">
            <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-6 px-margin-mobile md:flex-row md:px-margin-desktop">
                <div className="flex items-center gap-2 text-lg font-bold text-foreground">
                    <Image
                        src={SITE_CONFIG.logoUrl}
                        alt="VPetId Logo"
                        width={96}
                        height={24}
                        unoptimized
                        className="h-6 w-auto grayscale opacity-80"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                    {SITE_CONFIG.footerLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-xs text-muted transition-colors hover:text-accent"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="text-xs text-muted">© 2024 VPetId. Every pet deserves a digital identity.</div>
            </div>
        </footer>
    );
}
// app/onboarding/components/OnboardingHero.tsx
import Image from "next/image";

const heroImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDfievRWGaLyePOTmmAPQaTs0_JfrXWL7pYCXLmFXj3E1SDg8BQPMXICNtwYfBu5He-zOn9YIEMssmdIodwnksX4wUQl5ld64EwFtNFCkGUT3z3-lFbtJXNc97Qx04BjdLKl9hruB8rZnpezeho-9nJkulxgN2Ljz-MqlWqyomZvOWAEifjFeeBb9indnsU4zbwzqnHJwxMSqhUr9Nu1Gns-iHb_8_ulc4EjIZ8tUKD7oJWvV92v_eM2w";

export function OnboardingHero() {
    return (
        <div className="relative hidden w-1/2 overflow-hidden bg-background-secondary md:block">
            <Image
                src={heroImageUrl}
                alt="A young pet owner petting their Golden Retriever in a sunlit park"
                fill
                unoptimized
                priority
                className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute inset-x-8 bottom-8 text-white">
                <p className="mb-2 font-headline-md text-headline-md text-white">
                    Every pet deserves a digital identity.
                </p>
                <p className="font-body-md text-body-md text-white/90">
                    Join thousands of pet owners securing their furry friends.
                </p>
            </div>
        </div>
    );
}
// app/p/[code]/components/PublicPetHero.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CheckIcon, Cross2Icon, CameraIcon } from "@radix-ui/react-icons";

type PublicPetHeroProps = {
    petCode: string;
    petName: string;
    coverUrl: string | null;
    avatarUrl: string | null;
};

export function PublicPetHero({ petCode, petName, coverUrl, avatarUrl }: PublicPetHeroProps) {
    const t = useTranslations("PublicPet");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const previewSrc = avatarUrl ?? coverUrl;

    return (
        <>
            <div className="relative">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px] bg-background-secondary md:aspect-[21/9]">
                    {coverUrl ? (
                        <Image src={coverUrl} alt={petName} fill unoptimized className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-success/20">
                            <span className="material-symbols-outlined text-5xl text-accent/40">pets</span>
                        </div>
                    )}

                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-accent/90 px-3 py-1.5 shadow-sm backdrop-blur-md">
                        <CheckIcon className="h-3.5 w-3.5 text-accent-foreground" />
                        <span className="font-label-sm text-label-sm font-bold tracking-wide text-accent-foreground">
                            {t("verifiedProfile")}
                        </span>
                    </div>

                    <div className="absolute xl:bottom-4 bottom-none top-4 xl:top-60 left-4 flex items-center gap-2 rounded-full border border-separator bg-surface/90 px-3 py-1 shadow-sm backdrop-blur-md">
                        <span className="material-symbols-outlined text-[18px] text-link">badge</span>
                        <span className="font-label-sm text-label-sm font-semibold tracking-wider text-foreground">
                            {petCode}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => previewSrc && setIsPreviewOpen(true)}
                    aria-label={t("photoPreview.view", { name: petName })}
                    className="group cursor-pointer absolute left-1/2 top-full xl:h-52 h-32 w-32 xl:w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface bg-background-secondary shadow-[0px_4px_20px_rgba(15,23,42,0.12)]"
                >
                    {avatarUrl ? (
                        <Image
                            width={200}
                            height={200}
                            unoptimized
                            src={avatarUrl}
                            alt={petName}
                            className="h-full w-full rounded-full object-cover transition-opacity group-hover:opacity-90"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full">
                            <span className="material-symbols-outlined text-4xl text-muted">pets</span>
                        </div>
                    )}
                    <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
                        <CameraIcon className="h-3.5 w-3.5" />
                    </span>
                </button>
            </div>

            {isPreviewOpen && previewSrc && (
                <div
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setIsPreviewOpen(false)}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                >
                    <button
                        type="button"
                        onClick={() => setIsPreviewOpen(false)}
                        aria-label={t("photoPreview.close")}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                    >
                        <Cross2Icon className="h-5 w-5" />
                    </button>
                    <img
                        src={previewSrc}
                        alt={petName}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
                    />
                </div>
            )}
        </>
    );
}
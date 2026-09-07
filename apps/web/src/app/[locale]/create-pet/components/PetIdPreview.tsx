// app/create-pet/components/PetIdPreview.tsx
"use client";

import { ALLOWED_MIME_TYPES, MAX_AVATAR_SIZE_BYTES } from "@/lib/constants";
import { useRef } from "react";
import toast from "react-hot-toast";

type PetIdPreviewProps = {
    name: string;
    species: string;
    breed: string;
    avatarUrl: string | null;
    coverUrl: string | null;
    onAvatarChange: (file: File | null) => void;
    onCoverChange: (file: File | null) => void;
};

export function PetIdPreview({
    name,
    species,
    breed,
    avatarUrl,
    coverUrl,
    onAvatarChange,
    onCoverChange,
}: PetIdPreviewProps) {
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    function validateImageFile(
        file: File,
    ): boolean {
        if (
            !ALLOWED_MIME_TYPES.includes(
                file.type,
            )
        ) {
            toast.error(
                "Invalid image format. Please upload JPG, PNG, or WebP.",
            );

            return false;
        }

        if (
            file.size >
            MAX_AVATAR_SIZE_BYTES
        ) {
            toast.error(
                "Image is too large. Maximum size is 5MB.",
            );

            return false;
        }

        return true;
    }

    function handleAvatarInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            return;
        }

        if (!validateImageFile(file)) {
            e.target.value = "";
            return;
        }
        onAvatarChange(file);
        // reset so re-selecting the same file re-fires onChange
        e.target.value = "";
    }

    function handleCoverInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            return;
        }

        if (!validateImageFile(file)) {
            e.target.value = "";
            return;
        }
        onCoverChange(file);
        e.target.value = "";
    }

    return (
        <section className="overflow-hidden rounded-xl border border-separator bg-surface shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
            <div className="px-5 pt-4">
                <h3 className="text-center font-label-sm text-lg font-semibold uppercase tracking-widest text-muted">
                    Phofile Preview
                </h3>
            </div>

            {/* Cover: click to upload/replace */}
            <div className="relative mt-3 px-5">
                <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleCoverInputChange}
                />
                <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    aria-label={coverUrl ? "Change cover photo" : "Upload cover photo"}
                    className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-background-secondary transition-opacity"
                >
                    {coverUrl ? (
                        <img src={coverUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-success/20">
                            <span className="material-symbols-outlined text-3xl text-accent/40">pets</span>
                        </div>
                    )}

                    {/* Hover overlay hint */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[22px] text-white">photo_camera</span>
                        <span className="font-label-sm text-label-sm font-semibold text-white">
                            {coverUrl ? "Change Cover" : "Upload Cover"}
                        </span>
                    </div>

                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full border border-separator bg-surface/90 px-2 py-0.5 shadow-sm backdrop-blur-sm">
                        <span className="material-symbols-outlined text-[13px] text-link">badge</span>
                        <span className="font-label-sm text-[10px] font-semibold tracking-wide text-foreground">
                            VP-*****
                        </span>
                    </div>
                </button>

                {/* Avatar: click to upload/replace, overlaps cover bottom edge */}
                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarInputChange}
                />
                <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    aria-label={avatarUrl ? "Change profile photo" : "Upload profile photo"}
                    className="group absolute left-1/2 top-full h-40 w-40 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-surface bg-background-secondary shadow-sm"
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="material-symbols-outlined text-[20px] text-muted">pets</span>
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                        <span className="material-symbols-outlined text-[16px] text-white">add_a_photo</span>
                    </div>
                </button>
            </div>

            <div className="px-5 pb-5 pt-24 text-center">
                <p className="truncate font-label-md text-2xl font-bold text-foreground">
                    {name || "Pet Name"}
                </p>
                <p className="truncate font-label- text-lg text-muted">
                    {species || "Species"} • {breed || "Breed"}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-separator pt-3">
                    <div className="flex flex-col text-left">
                        <span className="font-label-sm text-lg text-muted">Digital ID Tag</span>
                        <span className="font-label-md text-lg font-bold text-accent">VP-*****</span>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-secondary">
                        <span className="material-symbols-outlined text-[18px] text-muted">qr_code_2</span>
                    </div>
                </div>

                <p className="mt-3 font-label-sm text-md text-muted">
                    Tap the cover or photo above to upload
                </p>
            </div>
        </section>
    );
}
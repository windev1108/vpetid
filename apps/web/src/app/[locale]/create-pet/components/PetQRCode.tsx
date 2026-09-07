"use client";

import QRCode from "react-qr-code";

interface PetQRCodeProps {
    petCode: string;
}

export function PetQRCode({
    petCode,
}: PetQRCodeProps) {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        window.location.origin;

    const petUrl =
        `${baseUrl}/public/${petCode}`;

    return (
        <div className="flex flex-col items-center">
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <QRCode
                    value={petUrl}
                    size={180}
                    bgColor="#ffffff"
                    fgColor="#111827"
                    level="H"
                />
            </div>

            <p className="mt-4 text-center text-sm text-muted">
                Scan this QR code to view
                this pet&apos;s digital identity.
            </p>

            <p className="mt-1 max-w-xs truncate text-center text-xs text-muted">
                {petUrl}
            </p>
        </div>
    );
}
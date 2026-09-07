// app/pets/components/PetsHeader.tsx
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/lib/routes";
import { Button } from "@heroui/react";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";

type PetsHeaderProps = {
    total: number;
};

export function PetsHeader({ total }: PetsHeaderProps) {
    const router = useRouter()
    const t = useTranslations("Pet")
    return (
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-foreground md:font-headline-xl md:text-headline-xl">
                    {t("title")}
                </h1>
                <p className="mt-2 font-body-md text-body-md text-muted">
                    {t("subtitle")}
                </p>
            </div>
            <Button
                onPress={() => router.push(ROUTES.CREATE_PET)}
                className="h-12 gap-2 bg-accent px-6 font-label-md text-label-md font-semibold text-accent-foreground shadow-sm hover:bg-[color:var(--color-accent-hover)]"
            >
                <PlusIcon className="h-5 w-5" />
                {t("add_pet_button")}
            </Button>
        </div>
    );
}
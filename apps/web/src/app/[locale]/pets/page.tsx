// app/pets/page.tsx
'use client';
import { usePets } from "@/services/pets/queries";
import MyPetsContent from "./components/MyPetsContent";

export default function PetsPage() {
    const { data: pets } = usePets()
    return (
        <div className="min-h-screen bg-surface text-foreground">
            <MyPetsContent pets={pets ?? []} />
        </div>
    );
}
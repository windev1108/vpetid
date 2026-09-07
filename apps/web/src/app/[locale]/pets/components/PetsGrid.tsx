// app/pets/components/PetsGrid.tsx
import PetCard from "@/app/components/common/PetCard";
import { Pet } from "@/services/pets/types";

type PetsGridProps = {
    pets: Pet[];
};

export function PetsGrid({ pets }: PetsGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => (
                <PetCard
                    key={pet.id}
                    pet={pet}
                />
            ))}
        </div>
    );
}
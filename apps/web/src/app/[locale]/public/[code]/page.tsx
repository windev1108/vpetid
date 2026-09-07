// app/p/[code]/page.tsx
import { PetDetailViewPublic } from "./components/PetDetailViewPublic";

export default async function PublicPetDetailPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    return <PetDetailViewPublic petCode={code} />;
}
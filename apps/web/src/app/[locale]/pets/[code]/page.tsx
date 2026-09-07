import { PetDetailView } from "./components/PetDetailView";

export default async function PetDetailPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    return <PetDetailView petCode={code} />;
}
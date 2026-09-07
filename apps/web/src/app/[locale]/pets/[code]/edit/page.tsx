import PetEditView from "./components/PetEditView";

export default async function PetDetailPage({
    params,
}: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    return <PetEditView petCode={code} />;
}
import { RegistrationDetails } from "@/components/admin/RegistrationDetails";

export default async function AdminRegistrationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RegistrationDetails id={id} />;
}
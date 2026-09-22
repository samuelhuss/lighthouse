import { PaymentDetails } from "@/components/admin/PaymentDetails";

export default async function AdminPaymentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PaymentDetails id={id} />;
}

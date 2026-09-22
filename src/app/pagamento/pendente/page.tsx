import { Suspense } from "react";
import { PaymentStatusPage } from "@/components/payment/PaymentStatusPage";

export default function PaymentPendingPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}><PaymentStatusPage kind="pending" /></Suspense>;
}
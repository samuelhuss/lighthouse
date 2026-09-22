import { Suspense } from "react";
import { PaymentStatusPage } from "@/components/payment/PaymentStatusPage";

export default function PaymentErrorPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}><PaymentStatusPage kind="error" /></Suspense>;
}
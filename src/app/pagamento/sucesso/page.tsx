import { Suspense } from "react";
import { PaymentStatusPage } from "@/components/payment/PaymentStatusPage";

export default function PaymentSuccessPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}><PaymentStatusPage kind="success" /></Suspense>;
}